import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;

  
  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  
  const jobDetails = await Job.findById(id);
  console.log("job details:",jobDetails);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  const currentDate = new Date();
  if (jobDetails.expiryDate && new Date(jobDetails.expiryDate) < currentDate) {
    return next(new ErrorHandler("This job has expired and cannot be applied for.", 400));
  }
  
  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": id,
    "jobSeekerInfo.id": req.user._id,
  });
  if (isAlreadyApplied) {
    return next(
      new ErrorHandler("You have already applied for this job.", 400)
    );
  }

  
  if (!req.user.resume || !req.user.resume.url) {
    return next(
      new ErrorHandler(
        "Please update your profile and upload your resume before applying.",
        400
      )
    );
  }
  jobDetails.applicant=req.user._id;
  await jobDetails.save();
  console.log("job details aplplicant:",jobDetails.applicant)

  
  const jobSeekerInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Job Seeker",
    resume: {
      public_id: req.user.resume.public_id,
      url: req.user.resume.url,
    },
  };

  
  const employerInfo = {
    id: jobDetails.postedBy,
    role: "Employer",
  };
  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.title,
    CompanyName:jobDetails.companyName,
    expiryDate:jobDetails.expiryDate

  };

  
  const application = await Application.create({
    jobSeekerInfo,
    employerInfo,
    jobInfo,
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    application,
  });
});




export const employerGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;

    const applications = await Application.find({
      "employerInfo.id": _id,
      "deletedBy.employer": false,
    })
      .populate({
        path: "jobSeekerInfo.id",
        model: "User",
        select:
          "name email phone address skills education experienceLevel yearsOfExperience bio resume profileCompleted",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  }
);
export const jobSeekerGetAllApplication=catchAsyncErrors(async(req,res,next)=>
{
  const { _id } = req.user;
  const applications = await Application.find({
    "jobSeekerInfo.id": _id,
    "deletedBy.jobSeeker": false,
  });
  res.status(200).json({
    success: true,
    applications,
  });
})
export const deleteApplicaton = catchAsyncErrors(async (req, res, next) => {
  console.log("delete application function triggered")
  const { id } = req.params;
  const { role, _id: userId } = req.user;

  
  const application = await Application.findById(id);
  if (!application) {
    console.log("Application not found:", id);
    return next(new ErrorHandler("Application not found.", 404));
  }

  
  const job = await Job.findById(application.jobInfo.jobId);
  console.log("Job fetched:", job);
  if (!job) {
    console.log("Job not found for application:", application._id);
    return next(new ErrorHandler("Job not found.", 404));
  }

  
  application.deletedBy = application.deletedBy || { employer: false, jobSeeker: false };
  console.log("Before update:", application.deletedBy);

  
  switch (role) {
    case "Job Seeker":
      application.deletedBy.jobSeeker = true;
      break;
    case "Employer":
      application.deletedBy.employer = true;
      break;
    default:
      console.log("Unknown role for application delete.");
      return next(new ErrorHandler("Unauthorized role.", 403));
  }

  console.log("After update:", application.deletedBy);
  await application.save();

  
  if (application.deletedBy.employer && application.deletedBy.jobSeeker) {
    console.log("Both employer and job seeker deleted, removing application:", application._id);

    if (Array.isArray(job.applicant) && job.applicant.length > 0) {
      job.applicant = job.applicant.filter(
        (applicantId) => applicantId.toString() !== userId.toString()
      );
      await job.save();
    } else {
      console.log("Job applicant list is empty or not an array:", job.applicant);
    }

    await application.deleteOne();
    console.log("Application deleted successfully");
  }

  res.status(200).json({
    success: true,
    message: "Application deleted successfully.",
  });
});


export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    application.status = status;
    await application.save();

    
    const updatedApplications = await Application.find(); 

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
      applications: updatedApplications, 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};




export const getApplicationById = async (req, res) => {
  try {
    const {id}=req.params;
    const application = await Application.findById(id)
      .populate("jobSeekerInfo", "name email resume")
      .populate("jobInfo", "jobTitle");
      console.log("Application id",id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



