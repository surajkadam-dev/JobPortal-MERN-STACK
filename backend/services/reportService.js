import Report from '../models/Report.js';

/* 🚨 All Reports (Admin) */
export const getAllReportsService = async () => {
  return await Report.find();
};

/* 🚨 Reports by Employer */
export const getReportsByEmployerService = async (employerId) => {
  return await Report.find({ employerId });
};