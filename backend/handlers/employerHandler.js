import { getEmployerApplicationsService } from "../services/applicationService.js";
import { getEmployerInterviewsService } from "../services/interviewService.js";
import { getEmployerJobsService } from "../services/jobService.js";

export const employerHandler = async ({ intentData, user }) => {

  const { intent, subIntent } = intentData;
  let context = "";

  switch (intent) {

    case "applications":
      const applications = await getEmployerApplicationsService(user._id);

      const filteredApps = subIntent
        ? applications.filter(app => app.status === subIntent)
        : applications;

      context = `
Applications Received:
${filteredApps.map(app =>
  `Job: ${app.jobInfo.jobTitle}
Candidate: ${app.jobSeekerInfo.name}
Status: ${app.status}`
).join("\n\n")}
`;
      break;

    case "interviews":
      const interviews = await getEmployerInterviewsService(user._id);

      context = `
Scheduled Interviews:
${interviews.map(int =>
  `Candidate ID: ${int.candidateId}
Date: ${int.dateTime}
Status: ${int.status}`
).join("\n")}
`;
      break;

    case "job_management":
      const jobs = await getEmployerJobsService(user._id);

      context = `
Your Jobs:
${jobs.map(job =>
  `${job.title} - ${job.appliedCount} applications`
).join("\n")}
`;
      break;

    default:
      context = "Provide hiring advice.";
  }

  return context;
};