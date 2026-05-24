import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // added for navigation
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearAllJobErrors,
  deleteJob,
  getMyJobs,
  resetJobSlice,
} from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import {
  FiTrash2,
  FiBriefcase,
  FiPackage,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiEye, // added icon for view
} from "react-icons/fi";

const MyJobs = () => {
  const { loading, error, myJobs, message } = useSelector(
    (state) => state.jobs,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate(); // initialize navigation

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
    dispatch(getMyJobs());
  }, [dispatch, error, message]);

  const handleDeleteJob = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );
    if (confirmDelete) {
      dispatch(deleteJob(id));
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil((myJobs?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = myJobs?.slice(startIndex, endIndex) || [];

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 max-w-7xl mx-auto"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        My Job Postings
      </motion.h1>

      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" />
        </div>
      ) : myJobs?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm"
        >
          <FiBriefcase className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700">
            No Jobs Posted Yet
          </h3>
          <p className="text-gray-500 mt-2">
            Start by creating your first job posting
          </p>
        </motion.div>
      ) : (
        <>
          {/* Card Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {currentJobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={cardVariants}
                  exit="exit"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FiBriefcase className="text-blue-600" />
                      {job.title}
                    </h4>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiPackage className="text-gray-500 w-5 h-5" />
                      <span className="text-sm">{job.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin className="text-gray-500 w-5 h-5" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiDollarSign className="text-gray-500 w-5 h-5" />
                      <span className="text-sm">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock className="text-gray-500 w-5 h-5" />
                      <span className="text-sm">{job.jobType}</span>
                    </div>
                  </div>

                  {/* Card Footer with two buttons */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* View Job Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/job/${job._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <FiEye className="w-4 h-4" />
                        View Job
                      </motion.button>

                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteJob(job._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center gap-4 mt-8"
            >
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                <FiChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <span className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                Next
                <FiChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default MyJobs;
