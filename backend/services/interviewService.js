import { Interview } from "../models/Interview.js";

/* 👤 Candidate Interviews */
export const getCandidateInterviewsService = async (candidateId) => {
  return await Interview.find({ candidateId }).populate("jobId");
};

/* 👔 Employer Interviews */
export const getEmployerInterviewsService = async (employerId) => {
  return await Interview.find({ employerId }).populate("jobId");
};