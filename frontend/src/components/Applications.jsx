import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearAllApplicationErrors,
  deleteApplication,
  fetchEmployerApplications,
  resetApplicationSlice,
  updateApplicationStatus,
} from "../store/slices/applicationSlice";
import Spinner from "./Spinner";
import {
  FiTrash2,
  FiFileText,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiBookOpen,
  FiAward,
  FiCpu,
  FiCheck,
  FiStar,
} from "react-icons/fi";

const Applications = () => {
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter state
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchEmployerApplications());
  }, [dispatch, error, message]);

  const handleStatusChange = async (event, id) => {
    const newStatus = event.target.value;
    await dispatch(updateApplicationStatus(id, newStatus));

    // Show confirmation toast when shortlisted
    if (newStatus === "Shortlisted") {
      toast.success(
        "Candidate shortlisted! You can now schedule an interview.",
      );
    }
  };

  const handleDeleteApplication = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      dispatch(deleteApplication(id));
    }
  };

  const handleScheduleInterview = (applicationId, jobId, candidateId) => {
    navigate(`/schedule/${applicationId}/${jobId}/${candidateId}`);
  };

  const openApplicantModal = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const closeApplicantModal = () => {
    setSelectedApplicant(null);
  };

  // Filter applications by status
  const filteredApplications = applications?.filter((app) =>
    filterStatus === "all" ? true : app.status === filterStatus,
  );

  // Pagination calculations
  const totalPages = Math.ceil(
    (filteredApplications?.length || 0) / itemsPerPage,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications =
    filteredApplications?.slice(startIndex, endIndex) || [];

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

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-800", icon: FiClock };
      case "Shortlisted":
        return { bg: "bg-purple-100", text: "text-purple-800", icon: FiStar };
      case "accepted":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          icon: FiCheckCircle,
        };
      case "rejected":
        return { bg: "bg-rose-100", text: "text-rose-800", icon: FiXCircle };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: FiClock };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with stats and filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FiBriefcase className="text-blue-600" />
              Job Applications
            </h1>
            <p className="text-gray-600 mt-1">
              You have {filteredApplications?.length || 0} application(s)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Spinner size="lg" />
          </div>
        ) : !filteredApplications || filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm"
          >
            <FiFileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700">
              No Applications Found
            </h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              {filterStatus !== "all"
                ? `No ${filterStatus} applications at the moment.`
                : "Applications will appear here when candidates apply."}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Cards Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="wait">
                {currentApplications.map((app) => {
                  const statusBadge = getStatusBadge(app.status);
                  const StatusIcon = statusBadge.icon;

                  // Extract applicant data from populated user (inside jobSeekerInfo.id)
                  const applicant = app.jobSeekerInfo?.id || {};
                  const applicantName = applicant.name || "N/A";
                  const applicantEmail = applicant.email || "N/A";
                  const applicantPhone = applicant.phone || "N/A";
                  const applicantAddress = applicant.address || "N/A";
                  const resumeUrl = applicant.resume?.url;

                  return (
                    <motion.div
                      key={app._id}
                      variants={cardVariants}
                      exit="exit"
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Card Header with Job Title and Status */}
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-200/60">
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FiBriefcase className="text-blue-600" />
                            {app.jobInfo?.jobTitle || "Untitled Job"}
                          </h4>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{app.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-4">
                        {/* Applicant Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiUser className="text-gray-500 w-4 h-4" />
                            <span className="font-medium">{applicantName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiMail className="text-gray-500 w-4 h-4" />
                            <span className="break-all">{applicantEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiPhone className="text-gray-500 w-4 h-4" />
                            <span>{applicantPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiMapPin className="text-gray-500 w-4 h-4" />
                            <span className="truncate">{applicantAddress}</span>
                          </div>
                        </div>

                        {/* Status Selector (inline) */}
                        <div className="pt-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Update Status
                          </label>
                          <select
                            onChange={(e) => handleStatusChange(e, app._id)}
                            value={app.status}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          >
                            <option value="pending">Pending</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-200/60 flex flex-col gap-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => openApplicantModal(applicant)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                        >
                          <FiEye className="w-4 h-4" />
                          View Details
                        </button>

                        <button
                          onClick={() => handleDeleteApplication(app._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </button>

                        {resumeUrl && (
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <FiFileText className="w-4 h-4" />
                            View Resume
                          </a>
                        )}

                        {/* Schedule Interview - Only show when status is shortlisted */}
                        {app.status === "Shortlisted" && (
                          <button
                            onClick={() =>
                              handleScheduleInterview(
                                app._id,
                                app.jobInfo?.jobId,
                                applicant._id,
                              )
                            }
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                          >
                            <FiCalendar className="w-4 h-4" />
                            Schedule Interview
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
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
      </div>

      {/* Applicant Details Modal */}
      <AnimatePresence>
        {selectedApplicant && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeApplicantModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  Applicant Details
                </h2>
                <button
                  onClick={closeApplicantModal}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Profile Completion Badge */}
                {selectedApplicant.profileCompleted !== undefined && (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      selectedApplicant.profileCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedApplicant.profileCompleted ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Profile Complete
                      </>
                    ) : (
                      <>
                        <FiClock className="w-4 h-4" />
                        Profile Incomplete
                      </>
                    )}
                  </div>
                )}

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoItem
                      icon={<FiUser />}
                      label="Name"
                      value={selectedApplicant.name}
                    />
                    <InfoItem
                      icon={<FiMail />}
                      label="Email"
                      value={selectedApplicant.email}
                    />
                    <InfoItem
                      icon={<FiPhone />}
                      label="Phone"
                      value={selectedApplicant.phone}
                    />
                    <InfoItem
                      icon={<FiMapPin />}
                      label="Address"
                      value={selectedApplicant.address}
                    />
                  </div>
                </div>

                {/* Skills */}
                {selectedApplicant.skills?.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiCpu className="text-blue-600" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedApplicant.education && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiBookOpen className="text-blue-600" />
                      Education
                    </h3>
                    <div className="space-y-2">
                      <InfoItem
                        label="Qualification"
                        value={selectedApplicant.education.qualification}
                      />
                      <InfoItem
                        label="College/Institute"
                        value={selectedApplicant.education.college}
                      />
                      <InfoItem
                        label="Graduation Year"
                        value={selectedApplicant.education.graduationYear}
                      />
                    </div>
                  </div>
                )}

                {/* Experience */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiAward className="text-blue-600" />
                    Experience
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoItem
                      label="Experience Level"
                      value={selectedApplicant.experienceLevel}
                    />
                    <InfoItem
                      label="Years of Experience"
                      value={selectedApplicant.yearsOfExperience}
                    />
                  </div>
                </div>

                {/* Bio */}
                {selectedApplicant.bio && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiFileText className="text-blue-600" />
                      Bio
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedApplicant.bio}
                    </p>
                  </div>
                )}

                {/* Resume Link */}
                {selectedApplicant.resume?.url && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiFileText className="text-blue-600" />
                      Resume
                    </h3>
                    <a
                      href={selectedApplicant.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FiFileText />
                      View Resume PDF
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper component for displaying info items
const InfoItem = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-gray-500 mt-0.5">{icon}</span>}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Applications;
