import {
  searchJobsService,
  matchJobsBySkillsService
} from "../services/jobService.js";

import { getUserApplicationsService } from "../services/applicationService.js";
import { getCandidateInterviewsService } from "../services/interviewService.js";

export const jobSeekerHandler = async ({ intentData, user }) => {

  const { intent, subIntent, city, skill } = intentData;

  let context = "";

  switch (intent) {

    /* ======================================
       🔹 JOB SEARCH
    ====================================== */
    case "job_search":

      let jobs = [];

      // If specific skill detected → use skill matching
      if (skill) {
        jobs = await matchJobsBySkillsService([skill]);
      }
      // Otherwise use keyword + city search
      else {
        jobs = await searchJobsService({
          city,
          keyword: null
        });
      }

      if (!jobs || jobs.length === 0) {
        context = "No matching jobs found based on your request.";
        break;
      }

      context = `
Matching Jobs:
${jobs.map(job => `
Title: ${job.title}
Company: ${job.companyName}
Location: ${job.location}
Salary: ${job.salary}
Required Skills: ${job.requiredSkills?.join(", ") || "Not specified"}
`).join("\n")}
`;
      break;

    /* ======================================
       🔹 APPLICATION STATUS
    ====================================== */
    case "applications":

      const applications = await getUserApplicationsService(user._id);

      const filteredApps = subIntent
        ? applications.filter(app =>
            app.status?.toLowerCase() === subIntent.toLowerCase()
          )
        : applications;

      if (!filteredApps || filteredApps.length === 0) {
        context = "You have no applications matching your query.";
        break;
      }

      context = `
Your Applications:
${filteredApps.map(app => `
Job: ${app.jobInfo.jobTitle}
Company: ${app.jobInfo.CompanyName}
Status: ${app.status}
Expiry Date: ${new Date(app.jobInfo.expiryDate).toDateString()}
`).join("\n")}
`;
      break;

    /* ======================================
       🔹 INTERVIEWS
    ====================================== */
    case "interviews":

      const interviews = await getCandidateInterviewsService(user._id);

      if (!interviews || interviews.length === 0) {
        context = "You have no scheduled interviews.";
        break;
      }

      context = `
Your Interviews:
${interviews.map(int => `
Job: ${int.jobId?.title}
Date: ${new Date(int.dateTime).toLocaleString()}
Status: ${int.status}
Meeting Link: ${int.meetingLink || "Not provided"}
`).join("\n")}
`;
      break;

    /* ======================================
       🔹 GENERAL
    ====================================== */
    default:
      context = `
Provide career advice related to resume building,
skill improvement, interview preparation,
and job searching strategies.
`;
  }

  return context;
};