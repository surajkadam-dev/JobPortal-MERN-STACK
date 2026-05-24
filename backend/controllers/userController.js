import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import {Job} from "../models/jobSchema.js"
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from '../utils/jwtToken.js';


export const register = catchAsyncErrors(async (req, res, next) => {

  const { name, email, phone, address, password, role, secretKey } = req.body;

  if (!name || !email || !phone || !address || !password || !role) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  if (role === "Admin") {
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return next(new ErrorHandler("Invalid admin secret key.", 403));
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already registered.", 400));
  }

  const user = await User.create({
    name,
    email,
    phone,
    address,
    password,
    role,
    isAdmin: role === "Admin",
    profileCompleted: role === "Admin" ? true : false
  });

  sendToken(user, 201, res, "User Registered Successfully");
});
export const completeProfile = catchAsyncErrors(async (req, res, next) => {

  let updateData = {};

  if (req.body.skills && Array.isArray(req.body.skills)) {
    updateData.skills = req.body.skills;
  }

  if (req.body.bio) {
    updateData.bio = req.body.bio;
  }

  if (req.body.experienceLevel) {
    updateData.experienceLevel = req.body.experienceLevel;
  }

  if (req.body.yearsOfExperience) {
    updateData.yearsOfExperience = req.body.yearsOfExperience;
  }

  // Nested Education (dot notation)
  if (req.body.qualification)
    updateData["education.qualification"] = req.body.qualification;

  if (req.body.college)
    updateData["education.college"] = req.body.college;

  if (req.body.graduationYear)
    updateData["education.graduationYear"] = req.body.graduationYear;

  // Resume upload
  if (req.files && req.files.resume) {
    const resume = req.files.resume;

    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: "Job Portal" }
    );

    updateData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    };
  }

  updateData.profileCompleted = true;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile completed successfully",
    user
  });
});
export const login = catchAsyncErrors(async (req, res, next) => {

  const { email, password } = req.body;
  console.log(req.body)

  if (!email || !password) {
    return next(new ErrorHandler("Email and Password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Auto unblock check
  user.checkUnblockStatus();
  await user.save();

  if (user.isBlocked) {
    return next(
      new ErrorHandler(
        "Your account is temporarily blocked. Please try again later.",
        403
      )
    );
  }

  sendToken(user, 200, res, "Login successful");

});

export const logout =catchAsyncErrors(async(req,res,next)=>
{
  res.status(200).cookie("token","",{
    expires:new Date(0),
    httpOnly:true,
    path:"/"
  }).json({
    success:true,
    message:"user logout successfully"
  })
})

export const getUser=catchAsyncErrors(async (req,res,next)=>
{
  const user=req.user
  res.status(200).json(
    {
      success:true,
      user,
    }
  )
})

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const existingUser = await User.findById(req.user.id);
  if (!existingUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  const {
    name,
    email,
    phone,
    address,
    experienceLevel,
    yearsOfExperience,
    bio
  } = req.body;

  // Email uniqueness check
  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== req.user.id) {
      return next(new ErrorHandler("Email already in use.", 400));
    }
  }

  let updateData = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  if (experienceLevel) updateData.experienceLevel = experienceLevel;
  if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
  if (bio) updateData.bio = bio;

  // Skills
  const skills = req.body["skills[]"];
  if (skills) {
    updateData.skills = Array.isArray(skills) ? skills : [skills];
  }

  // Education
  const qualification = req.body["education[qualification]"];
  const college = req.body["education[college]"];
  const graduationYear = req.body["education[graduationYear]"];
  if (qualification || college || graduationYear) {
    updateData.education = {
      qualification: qualification || "",
      college: college || "",
      graduationYear: graduationYear || null,
    };
  }

  // Resume
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    if (existingUser.resume?.public_id) {
      await cloudinary.uploader.destroy(existingUser.resume.public_id);
    }
    const uploadedResume = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: "Job Portal" }
    );
    updateData.resume = {
      public_id: uploadedResume.public_id,
      url: uploadedResume.secure_url,
    };
  }

  // Merge data for completeness check
  const mergedUser = {
    ...existingUser.toObject(),
    ...updateData,
  };

  // Compute profile completion (ensuring boolean)
  const isProfileComplete = Boolean(
    mergedUser.skills?.length &&
    mergedUser.education?.qualification?.trim() &&
    mergedUser.experienceLevel &&
    mergedUser.resume?.url
  );

  updateData.profileCompleted = isProfileComplete;

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});


export const updatePassword=catchAsyncErrors(async(req,res,next)=>
{
  const user=await User.findById(req.user.id).select("+password")

  const isPasswordMatched=await user.comparePassword(req.body.oldPassword)

  if(!isPasswordMatched)
  {
    return next(new ErrorHandler("Old Password is incorrect",400))

  }
  if(req.body.newPassword !== req.body.confirmPassword)
  {
    return next(new ErrorHandler("New Password and confirm password do not match"),400)
  }

  user.password=req.body.newPassword
  await user.save()

  sendToken(user,200,res,"password updated successfully")
})

export const saveJob = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { jobId } = req.params;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.savedJobs.includes(jobId)) {
    return next(new ErrorHandler("Job already saved", 400));
  }

  user.savedJobs.push(jobId);
  await user.save();

  res.status(200).json({ success: true, message: "Job saved successfully" });
});

export const unsaveJob = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { jobId } = req.params;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
  await user.save();

  res.status(200).json({ success: true, message: "Job removed from saved jobs" });
});




export const getSavedJobs = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).populate({
      path: "savedJobs",
      model: Job, 
      select: "title companyName introduction location salary jobType jobPostedOn", 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs, 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
