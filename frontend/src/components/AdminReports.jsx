import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import {
  FiAlertCircle,
  FiBriefcase,
  FiUser,
  FiEdit,
  FiClock,
  FiTrash,
} from "react-icons/fi";
import {
  getAllReports,
  updateReportStatus,
  deleteReport,
  clearReportErrors,
  clearMessage,
} from "../store/slices/reportSlice";

const AdminReports = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, message } = useSelector(
    (state) => state.report,
  );
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    dispatch(getAllReports());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearReportErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  const handleStatusChange = (reportId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [reportId]: newStatus }));
  };

  const handleUpdateStatus = (reportId) => {
    const newStatus = statusUpdates[reportId];
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }
    dispatch(updateReportStatus(reportId, newStatus));
  };

  const handleDelete = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      dispatch(deleteReport(reportId));
    }
  };

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

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Reviewed: "bg-blue-100 text-blue-800",
    "Action Taken": "bg-green-100 text-green-800",
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800 flex items-center"
      >
        <FiAlertCircle className="mr-3 text-indigo-600" />
        Reported Jobs Management
      </motion.h2>

      {loading ? (
        <div className="text-center py-8 text-indigo-600 animate-pulse">
          Loading reports...
        </div>
      ) : reports && reports.length > 0 ? (
        <>
          {/* Desktop/Tablet View */}
          <div className="hidden md:block">
            <motion.table
              className="w-full rounded-xl overflow-hidden shadow-lg"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <tr>
                  {[
                    "Job Title",
                    "Company",
                    "Reason",
                    "Reported By",
                    "Status",
                    "Actions",
                    "Delete",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="py-4 px-6 text-left font-medium text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <AnimatePresence>
                  {reports.map((report, index) => (
                    <motion.tr
                      key={report._id}
                      variants={itemVariants}
                      custom={index}
                      className="hover:bg-indigo-50 transition-colors"
                      whileHover={{ scale: 1.005 }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FiBriefcase className="h-5 w-5 mr-3 text-indigo-500" />
                          {report.jobTitle}
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
                          <FiAlertCircle className="h-5 w-5 mr-3 text-amber-500" />
                          {report.reason}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FiUser className="h-5 w-5 mr-3 text-rose-500" />
                          {report.reportedBy?.name || "N/A"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={statusUpdates[report._id] || report.status}
                          onChange={(e) =>
                            handleStatusChange(report._id, e.target.value)
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            statusColors[
                              statusUpdates[report._id] || report.status
                            ]
                          }`}
                        >
                          {Object.keys(statusColors).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          onClick={() => handleUpdateStatus(report._id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiEdit className="mr-2" />
                          Update
                        </motion.button>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          onClick={() => handleDelete(report._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiTrash className="h-5 w-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </motion.table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden grid gap-4">
            <AnimatePresence>
              {reports.map((report, index) => (
                <motion.div
                  key={report._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                  whileHover={{ y: -5 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiBriefcase className="h-6 w-6 mr-3 text-indigo-500" />
                        <h3 className="font-semibold text-gray-800">
                          {report.jobTitle}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          statusColors[
                            statusUpdates[report._id] || report.status
                          ]
                        }`}
                      >
                        {statusUpdates[report._id] || report.status}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FaBuilding className="h-5 w-5 mr-3 text-emerald-500" />
                      {report.companyName}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FiUser className="h-5 w-5 mr-3 text-rose-500" />
                      {report.reportedBy?.name || "N/A"}
                    </div>

                    <div className="text-gray-600">
                      <FiAlertCircle className="h-5 w-5 mr-3 inline-block text-amber-500" />
                      {report.reason}
                    </div>

                    <div className="flex flex-col gap-2">
                      <select
                        value={statusUpdates[report._id] || report.status}
                        onChange={(e) =>
                          handleStatusChange(report._id, e.target.value)
                        }
                        className={`w-full rounded-lg px-3 py-2 text-sm ${
                          statusColors[
                            statusUpdates[report._id] || report.status
                          ]
                        }`}
                      >
                        {Object.keys(statusColors).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleUpdateStatus(report._id)}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <FiEdit className="mr-2" />
                          Update
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(report._id)}
                          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <FiTrash className="mr-2" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <FiClock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No reports found</p>
        </motion.div>
      )}
    </div>
  );
};

export default AdminReports;
