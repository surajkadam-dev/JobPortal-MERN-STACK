import { getPlatformStatsService } from "../services/adminService.js";
import { getAllReportsService } from "../services/reportService.js";

export const adminHandler = async ({ intentData }) => {

  const { intent } = intentData;
  let context = "";

  switch (intent) {

    case "analytics":
      const stats = await getPlatformStatsService();

      context = `
Platform Statistics:
Users: ${stats.totalUsers}
Jobs: ${stats.totalJobs}
Applications: ${stats.totalApplications}
`;
      break;

    case "reports":
      const reports = await getAllReportsService();

      context = `
Reports:
${reports.map(rep =>
  `Job: ${rep.jobTitle}
Company: ${rep.companyName}
Status: ${rep.status}`
).join("\n\n")}
`;
      break;

    default:
      context = "Provide administrative guidance.";
  }

  return context;
};