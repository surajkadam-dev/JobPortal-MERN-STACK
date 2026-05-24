import { User } from "../models/userSchema.js";
import {Job} from "../models/jobSchema.js"
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";


export const blockEmployer = catchAsyncErrors(async (req, res, next) => {
  const { employerId } = req.params;
  const { durationInDays } = req.body;

  
  if (!durationInDays || durationInDays < 1) {
    return next(new ErrorHandler("Valid duration (at least 1 day) is required.", 400));
  }

  
  const employer = await User.findByIdAndUpdate(
    employerId,
    {
      $set: {
        isBlocked: true,
        unblockTime: new Date(Date.now() + durationInDays * 86400000), 
        lastBlocked: Date.now()
      }
    },
    {
      new: true,
      runValidators: true,
      select: 'name role isBlocked unblockTime lastBlocked' 
    }
  );

  if (!employer || employer.role !== "Employer") {
    return next(new ErrorHandler("Employer not found.", 404));
  }
   const io = req.app.get("io");
 io.to(employerId).emit("EMPLOYER_BLOCKED", {
  message: "Your account has been blocked by admin",
});

  res.status(200).json({
    success: true,
    message: `Employer ${employer.name} has been blocked for ${durationInDays} days.`,
    lastBlocked: employer.lastBlocked, 
    unblockTime: employer.unblockTime
  });
});


export const unblockEmployer = catchAsyncErrors(async (req, res, next) => {
  const { employerId } = req.params; 

  const employer = await User.findById(employerId);

  if (!employer || employer.role !== "Employer") {
    return next(new ErrorHandler("Employer not found.", 404));
  }

  if (!employer.isBlocked) {
    return next(new ErrorHandler("Employer is not blocked.", 400));
  }

  employer.isBlocked = false;
  employer.unblockTime = null; 
  employer.lastBlocked=null;
  await employer.save();

  res.status(200).json({
    success: true,
    message: `Employer ${employer.name} has been unblocked.`,
  });
});


export const getBlockedEmployers = catchAsyncErrors(async (req, res, next) => {
  const blockedEmployers = await User.find({ isBlocked: true });

  res.status(200).json({
    success: true,
    blockedEmployers,
  });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().select("-password"); 

  res.status(200).json({
    success: true,
    users,
  });
});

export const  getEmployerJobs=catchAsyncErrors(async(req,res,next)=>
{
  const { employerId } = req.params;  

  if (!employerId) {
    return next(new ErrorHandler("Employer ID is required.", 400));
  }
const myJobs=await Job.find({postedBy:employerId})
if (!myJobs.length) {
  return res.status(404).json({
    success: false,
    message: "No jobs found for this employer."
  });
}
res.status(200).json({
  success:true,
  myJobs
})
})