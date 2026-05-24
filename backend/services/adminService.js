import {User} from "../models/userSchema.js";
import {Job} from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";

/* 📊 Platform Statistics */
export const getPlatformStatsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();

  return {
    totalUsers,
    totalJobs,
    totalApplications
  };
};

/* 📊 Most Applied Jobs */
export const getMostAppliedJobsService = async () => {
  return await Job.find().sort({ appliedCount: -1 }).limit(5);
};