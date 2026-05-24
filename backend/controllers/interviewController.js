
import mongoose from 'mongoose';
import {Interview} from '../models/Interview.js'
import { User } from '../models/userSchema.js';
import { Job } from '../models/jobSchema.js';
import { sendEmail } from '../utils/sendEmail.js';
import ErrorHandler from '../middleware/error.js';


export const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, jobId, candidateId } = req.params;
    const { dateTime, meetingLink } = req.body;
    const employerId = req.user._id.toString();

    
    if (!jobId || !candidateId || !applicationId) {
      return next(new ErrorHandler("Missing applicationId, jobId, or candidateId", 400));
    }

    
    const [employer, candidate, job] = await Promise.all([
      User.findById(employerId),
      User.findById(candidateId),
      Job.findById(jobId),
    ]);

    if (!employer || !candidate || !job) {
      return next(new ErrorHandler("Employer, Candidate, or Job not found.", 404));
    }

    
    if (job.postedBy.toString() !== employerId) {
      return next(new ErrorHandler("You can only schedule interviews for your posted jobs.", 403));
    }

    
    const existingInterview = await Interview.findOne({
      applicationId: new mongoose.Types.ObjectId(applicationId),  
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateId: new mongoose.Types.ObjectId(candidateId),
    });
    

    if (existingInterview) {
      return next(new ErrorHandler("An interview has already been scheduled for this application.", 400));
    }

    
    const interview = await Interview.create({
      employerId,
      candidateId,
      jobId,
      applicationId,
      dateTime,
      meetingLink,
      status: "Scheduled",
    });

    
    const formattedDate = new Date(dateTime).toLocaleString();

    const candidateEmailContent = {
      email: candidate.email,
      subject: `Interview Scheduled for "${job.title}"`,
      message: `Hi ${candidate.name},\n\nYour interview for "${job.title}" is scheduled on ${formattedDate}.\nMeeting Link: ${meetingLink}\n\nBest,\nSuraj LTD`,
    };

    const employerEmailContent = {
      email: employer.email,
      subject: `Interview Confirmation with ${candidate.name}`,
      message: `Hi ${employer.name},\n\nYou have scheduled an interview with ${candidate.name} for "${job.title}" on ${formattedDate}.\nMeeting Link: ${meetingLink}\n\nBest,\nSuraj LTD`,
    };

    await Promise.all([sendEmail(candidateEmailContent), sendEmail(employerEmailContent)]);

    res.status(201).json({
      success: true,
      message: "Interview scheduled and email notifications sent.",
      interview,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


export const getUserInterviews = async (req, res, next) => {
  try {
    const { userId } = req.params;

    
    if (req.user._id.toString() !== userId && req.user.role !== 'Employer') {
      return next(new ErrorHandler('Unauthorized to view these interviews.', 403));
    }

    const interviews = await Interview.find({
      $or: [{ employerId: userId }, { candidateId: userId }],
    }).populate('jobId', 'title companyName expiryDate',).populate('candidateId', 'name email').populate('employerId', 'name email');

    res.status(200).json({ success: true, interviews });
  } catch (err) {
    next(new ErrorHandler('Error fetching interviews.', 500));
  }
};


export const updateInterviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    if (req.user.role !== 'Employer') {
      return next(new ErrorHandler('Only employers can update interview status.', 403));
    }

    const interview = await Interview.findById(id).populate('candidateId').populate('jobId');

    if (!interview) {
      return next(new ErrorHandler('Interview not found.', 404));
    }

    interview.status = status;
    await interview.save();

    
    await sendEmail({
      email: interview.candidateId.email,
      subject: 'Interview Status Updated',
      message: `Hi ${interview.candidateId.name},\n\nYour interview status for "${interview.jobId.title}" is updated to: ${status}.\n\nBest, Suraj LTD`,
    });

    res.status(200).json({ success: true, message: 'Interview status updated.', interview });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


export const deleteInterview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'Employer') {
      return next(new ErrorHandler('Only employers can delete interviews.', 403));
    }

    const interview = await Interview.findById(id).populate('candidateId').populate('jobId');

    if (!interview) {
      return next(new ErrorHandler('Interview not found.', 404));
    }

    await interview.deleteOne();

    
    await sendEmail({
      email: interview.candidateId.email,
      subject: 'Interview Cancelled',
      message: `Hi ${interview.candidateId.name},\n\nYour interview for "${interview.jobId.title}" has been cancelled.\n\nBest, Suraj LTD`,
    });

    res.status(200).json({ success: true, message: 'Interview deleted successfully.' });
  } catch (err) {
    next(new ErrorHandler('Error deleting interview.', 500));
  }
};
