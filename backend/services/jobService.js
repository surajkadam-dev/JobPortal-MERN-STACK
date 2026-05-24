import { Job } from "../models/jobSchema.js";

/* ===============================
   🔹 Search Jobs (Job Seeker)
=============================== */
export const searchJobsService = async ({ city, keyword }) => {

  const query = {
    expiryDate: { $gte: new Date() } // Only active jobs
  };

  if (city) {
    query.location = city;
  }

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { companyName: { $regex: keyword, $options: "i" } },
      { introduction: { $regex: keyword, $options: "i" } },
      { jobNiche: { $regex: keyword, $options: "i" } }
    ];
  }

  return await Job.find(query).limit(5);
};


/* ===============================
   🔹 Match Jobs By Skills
=============================== */
export const matchJobsBySkillsService = async (userSkills) => {

  if (!userSkills || userSkills.length === 0) {
    return [];
  }

  return await Job.find({
    expiryDate: { $gte: new Date() },
    requiredSkills: { $in: userSkills }
  }).limit(5);
};


/* ===============================
   🔹 Employer Posted Jobs
=============================== */
export const getEmployerJobsService = async (employerId) => {
  return await Job.find({
    postedBy: employerId
  });
};