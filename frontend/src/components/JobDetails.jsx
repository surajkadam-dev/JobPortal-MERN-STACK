import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleJob } from "../store/slices/jobSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaTag,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import {
  submitReport,
  clearReportErrors,
  clearMessage,
  resetReportState,
} from "../store/slices/reportSlice";
import UserNotAuthenticated from "./UserNotAuthenticated";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const JobDetails = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const { singleJob, loading, error } = useSelector((state) => state.jobs);
  const {
    loading: reportLoading,
    error: reportError,
    message: reportMessage,
  } = useSelector((state) => state.report);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, jobId]);

  useEffect(() => {
    if (reportError) {
      toast.error(reportError);
      dispatch(clearReportErrors());
    }
    if (reportMessage) {
      toast.success(reportMessage);
      dispatch(clearMessage());
      dispatch(resetReportState());
      setIsReportModalOpen(false);
      setReportReason("");
    }
  }, [reportError, reportMessage, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) return <UserNotAuthenticated />;

  if (!singleJob) return null;

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting this job.");
      return;
    }
    dispatch(submitReport({ jobId: singleJob._id, reason: reportReason }));
  };

  const requiredSkills = singleJob.requiredSkills || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Curved Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white border-b border-gray-200 overflow-hidden"
      >
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              {singleJob.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-gray-600">
              <span className="flex items-center">
                <FaBuilding className="mr-1 text-blue-600" />
                {singleJob.companyName}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-1 text-blue-600" />
                {singleJob.location}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom curved shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
        >
          {/* Key Highlights */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                icon: FaBuilding,
                label: "Company",
                value: singleJob.companyName,
              },
              {
                icon: FaMapMarkerAlt,
                label: "Location",
                value: singleJob.location,
              },
              {
                icon: FaMoneyBillWave,
                label: "Salary",
                value: `₹${singleJob.salary}/year`,
              },
              {
                icon: FaBriefcase,
                label: "Job Type",
                value: singleJob.jobType,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-sm transition-shadow border border-gray-100"
              >
                <div className="inline-flex p-2.5 rounded-full bg-blue-100 text-blue-600 mb-2">
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="font-medium text-gray-800 text-sm truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.section variants={fadeInUp} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
              Job Description
            </h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{singleJob.introduction}</p>
            </div>
          </motion.section>

          {/* Responsibilities & Qualifications */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.section
              variants={fadeInUp}
              className="bg-gray-50 rounded-xl p-5 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                Responsibilities
              </h3>
              {singleJob.responsibilities ? (
                <ul className="space-y-2">
                  {singleJob.responsibilities.split(",").map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></span>
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No responsibilities listed.
                </p>
              )}
            </motion.section>

            <motion.section
              variants={fadeInUp}
              className="bg-gray-50 rounded-xl p-5 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                Qualifications
              </h3>
              {singleJob.qualifications ? (
                <ul className="space-y-2">
                  {singleJob.qualifications.split(",").map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></span>
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No qualifications listed.
                </p>
              )}
            </motion.section>
          </div>

          {/* Required Skills */}
          <motion.section variants={fadeInUp} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
              Required Skills
            </h3>
            {requiredSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No specific skills required.
              </p>
            )}
          </motion.section>

          {/* Additional Information */}
          <motion.section
            variants={fadeInUp}
            className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
              Additional Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaUsers className="text-blue-600 w-4 h-4" />
                <span>
                  <strong className="font-medium text-gray-700">
                    Hiring Multiple:
                  </strong>{" "}
                  {singleJob.hiringMultipleCandidates ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaTag className="text-blue-600 w-4 h-4" />
                <span>
                  <strong className="font-medium text-gray-700">
                    Job Niche:
                  </strong>{" "}
                  {singleJob.jobNiche}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendarAlt className="text-blue-600 w-4 h-4" />
                <span>
                  <strong className="font-medium text-gray-700">Posted:</strong>{" "}
                  {new Date(singleJob.jobPostedOn).toDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="text-blue-600 w-4 h-4" />
                <span>
                  <strong className="font-medium text-gray-700">
                    Expires:
                  </strong>{" "}
                  {new Date(singleJob.expiryDate).toDateString()}
                </span>
              </div>
            </div>
          </motion.section>

          {/* Report Button */}
          <motion.div variants={fadeInUp} className="flex justify-end">
            <Button
              onClick={() => setIsReportModalOpen(true)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-full px-5 py-2 text-sm"
            >
              <FaExclamationTriangle className="mr-2 h-4 w-4 text-blue-600" />
              Report this job
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-blue-600 px-5 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaExclamationTriangle className="h-4 w-4" />
                  Report Job
                </h3>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleReportSubmit} className="p-5 space-y-4">
                <div>
                  <Label
                    htmlFor="jobTitle"
                    className="text-sm font-medium text-gray-700"
                  >
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    value={singleJob.title}
                    disabled
                    className="mt-1 bg-gray-100 border-gray-200 text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={singleJob.companyName}
                    disabled
                    className="mt-1 bg-gray-100 border-gray-200 text-gray-700 text-sm"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="reason"
                    className="text-sm font-medium text-gray-700"
                  >
                    Reason for Report
                  </Label>
                  <textarea
                    id="reason"
                    rows="4"
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Please describe the issue..."
                    required
                  ></textarea>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsReportModalOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={reportLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 text-sm"
                  >
                    {reportLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetails;
