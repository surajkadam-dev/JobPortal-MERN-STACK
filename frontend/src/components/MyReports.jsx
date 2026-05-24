import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import {
  FiBriefcase,
  FiFileText,
  FiCalendar,
  FiInbox,
  FiFlag,
} from "react-icons/fi";
import {
  getMyReports,
  clearReportErrors,
  resetReportState,
  clearMessage,
} from "../store/slices/reportSlice";
import { toast } from "react-toastify";

const MyReports = () => {
  const dispatch = useDispatch();
  const { reports, loading, message, error } = useSelector(
    (state) => state.report,
  );

  useEffect(() => {
    dispatch(getMyReports());
    if (error) {
      dispatch(clearReportErrors());
    }
    if (message) {
      dispatch(clearMessage());
      dispatch(resetReportState());
    }
  }, [dispatch]);

  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500"
      >
        <FiInbox className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">No reports submitted yet</p>
      </motion.div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
      >
        <FiFlag className="inline-block mr-2 mb-1 text-indigo-600" />
        My Reports
      </motion.h1>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <motion.table
          className="w-full rounded-xl overflow-hidden shadow-lg border-collapse"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-5 px-6 text-left font-medium">Job Title</th>
              <th className="py-5 px-6 text-left font-medium">Company</th>
              <th className="py-5 px-6 text-left font-medium">Reason</th>
              <th className="py-5 px-6 text-left font-medium">Status</th>
              <th className="py-5 px-6 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <AnimatePresence>
              {reports.map((report) => (
                <motion.tr
                  key={report._id}
                  variants={itemVariants}
                  className="hover:bg-indigo-50 transition-colors"
                  whileHover={{ scale: 1.005 }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FiBriefcase className="h-5 w-5 mr-3 text-indigo-500" />
                      <span className="font-medium text-gray-700">
                        {report.jobTitle}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FaBuilding className="h-5 w-5 mr-3 text-emerald-500" />
                      {report.companyName}
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <div className="flex items-center">
                      <FiFileText className="h-5 w-5 mr-3 text-amber-500" />
                      <span className="text-gray-600">{report.reason}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-2 rounded-full text-sm font-semibold ${
                        report.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FiCalendar className="h-5 w-5 mr-3 text-rose-500" />
                      <span className="text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        <AnimatePresence>
          {reports.map((report) => (
            <motion.div
              key={report._id}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
              whileHover={{ y: -3 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiBriefcase className="h-6 w-6 mr-3 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {report.jobTitle}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaBuilding className="h-5 w-5 mr-3 text-emerald-500" />
                  <span>{report.companyName}</span>
                </div>

                <div className="text-gray-600">
                  <FiFileText className="h-5 w-5 mr-3 inline-block text-amber-500" />
                  {report.reason}
                </div>

                <div className="flex items-center text-gray-500">
                  <FiCalendar className="h-5 w-5 mr-3 text-rose-500" />
                  <span className="text-sm">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyReports;
