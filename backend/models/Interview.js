import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  dateTime: { type: Date, required: true },
  meetingLink: { type: String },
  status: { type: String, enum: ['Scheduled', 'Pending', 'Accepted','Rejected'], default: 'Scheduled' }
});


export const Interview=mongoose.model('Interview', interviewSchema);
