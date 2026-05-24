import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchUserInterviews,
  updateInterviewStatus,
  deleteInterview,
} from "../store/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FaBuilding } from "react-icons/fa";
import {
  FiTrash2,
  FiMessageSquare,
  FiLink,
  FiClock,
  FiCalendar,
  FiBriefcase,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Spinner from "@/components/Spinner";

const UserInterviewsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviews, loading, error } = useSelector(
    (state) => state.interviews,
  );
  const { user } = useSelector((state) => state.user);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 cards per page (2 rows of 3 on desktop)

  useEffect(() => {
    dispatch(fetchUserInterviews(user._id));
  }, [dispatch, user._id]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateInterviewStatus(id, newStatus))
      .unwrap()
      .then(() => toast.success("Status updated successfully"))
      .catch(() => toast.error("Update failed"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      dispatch(deleteInterview(id))
        .unwrap()
        .then(() => toast.success("Interview deleted"))
        .catch((err) => toast.error(err || "Deletion failed"));
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil((interviews?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = interviews?.slice(startIndex, endIndex) || [];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Scheduled: "bg-blue-100 text-blue-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center mx-4"
      >
        {error}
      </motion.div>
    );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 max-w-7xl mx-auto"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center py-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        My Interviews
      </motion.h1>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Spinner className="text-blue-600 h-12 w-12" />
        </div>
      ) : interviews?.length > 0 ? (
        <>
          {/* Card Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {currentInterviews.map((interview) => (
                <motion.div
                  key={interview._id}
                  variants={itemVariants}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Header with Job Title and Status */}
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FiBriefcase className="text-blue-600 w-5 h-5" />
                        {interview.jobId?.title || "Untitled Job"}
                      </h2>
                      <span
                        className={`${statusColors[interview.status]} px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
                      >
                        {interview.status}
                      </span>
                    </div>

                    {/* Company Name - Hidden for Employers */}
                    {user.role !== "Employer" && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaBuilding className="mr-2 text-emerald-500 w-4 h-4" />
                        {interview.jobId?.companyName || "N/A"}
                      </div>
                    )}

                    {/* Candidate Name - Only for Employers? But might be useful for job seekers too. Keep as is. */}
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiUser className="mr-2 text-purple-500 w-4 h-4" />
                      {interview.candidateId?.name || "N/A"}
                    </div>

                    {/* Meeting Link */}
                    <div className="flex items-center text-blue-600 text-sm">
                      <FiLink className="mr-2 text-amber-500 w-4 h-4" />
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline truncate"
                      >
                        Join Meeting
                      </a>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FiCalendar className="mr-2 text-rose-500 w-4 h-4" />
                        {new Date(interview.dateTime).toLocaleDateString(
                          "en-GB",
                        )}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiClock className="mr-2 text-indigo-500 w-4 h-4" />
                        {new Date(interview.dateTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                      {user.role === "Employer" ? (
                        <div className="flex flex-col gap-2">
                          {/* Status Dropdown for Employers */}
                          <select
                            value={interview.status}
                            onChange={(e) =>
                              handleStatusChange(interview._id, e.target.value)
                            }
                            className={`${statusColors[interview.status]} w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium`}
                          >
                            {Object.keys(statusColors).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {/* Delete Button */}
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(interview._id)}
                              className="w-full flex items-center justify-center gap-2"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </motion.div>
                        </div>
                      ) : (
                        // Job Seeker Actions
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              navigate(`/interview/feedback/${interview._id}`)
                            }
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <FiMessageSquare className="w-4 h-4" />
                            Provide Feedback
                          </Button>
                        </motion.div>
                      )}
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
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300"
        >
          <FiCalendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No interviews scheduled yet
          </h3>
          <p className="text-gray-500 mt-2">
            Check back later or schedule a new interview.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserInterviewsList;
