import { Application } from "../models/applicationSchema.js";

/* 👤 Job Seeker Applications */
export const getUserApplicationsService = async (userId) => {
  return await Application.find({
    "jobSeekerInfo.id": userId,
    "deletedBy.jobSeeker": false
  });
};

/* 👔 Employer Applications */
export const getEmployerApplicationsService = async (employerId) => {
  return await Application.find({
    "employerInfo.id": employerId,
    "deletedBy.employer": false
  });
};

/* 👔 Employer Applications by Status */
export const getEmployerApplicationsByStatusService = async (
  employerId,
  status
) => {
  return await Application.find({
    "employerInfo.id": employerId,
    status,
    "deletedBy.employer": false
  });
};