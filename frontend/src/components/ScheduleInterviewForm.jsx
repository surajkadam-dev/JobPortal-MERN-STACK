import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  scheduleInterview,
  clearInterviewErrors,
} from "../store/slices/interviewSlice";
// Remove fetchJobs import if not needed elsewhere
import { getUser } from "../store/slices/userSlice";
import { fetchApplicationById } from "../store/slices/applicationSlice";
import {
  Calendar,
  Clock,
  Link2,
  Mail,
  Briefcase,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const ScheduleInterviewForm = () => {
  const { applicationId, jobId, candidateId } = useParams();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector((state) => state.interviews);
  const { application } = useSelector((state) => state.applications);

  const [candidateEmail, setCandidateEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    if (!isAuthenticated) dispatch(getUser());
    // Removed dispatch(fetchJobs()) – it's not used and was causing the error
    dispatch(fetchApplicationById(applicationId));

    if (error) {
      toast.error(error);
      dispatch(clearInterviewErrors());
    }

    if (message) {
      toast.success(message);
      setDateTime("");
      setMeetingLink("");
    }
  }, [dispatch, error, message, isAuthenticated, applicationId]);

  useEffect(() => {
    // Use optional chaining to safely access email
    if (application?.jobSeekerInfo?.email) {
      setCandidateEmail(application.jobSeekerInfo.email);
    }
  }, [application]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!candidateEmail || !jobId || !dateTime || !meetingLink) {
      toast.error("Please fill in all fields.");
      return;
    }

    const selectedDateTime = new Date(dateTime);
    const now = new Date();
    now.setSeconds(0, 0);

    if (selectedDateTime <= now) {
      toast.error("Cannot schedule interview for past dates or times.");
      return;
    }

    dispatch(
      scheduleInterview(applicationId, jobId, candidateId, {
        candidateEmail,
        dateTime,
        meetingLink,
      }),
    );
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/3"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Navigation
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Quickly return to your dashboard or review the form
                    instructions.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/dashboard"
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    Go to Dashboard
                  </Link>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Instructions
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>• Candidate email and job title are pre-filled.</li>
                      <li>• Select a future date and time.</li>
                      <li>
                        • Provide a valid meeting link (Zoom, Google Meet,
                        etc.).
                      </li>
                      <li>
                        • Both candidate and employer will receive email
                        confirmations.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:w-2/3"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Schedule Interview
                </h1>
                <p className="text-gray-500">
                  Fill in the details below to send an interview invitation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Candidate Email */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Candidate Email
                  </label>
                  <input
                    type="email"
                    value={candidateEmail}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-not-allowed"
                  />
                </motion.div>

                {/* Job Title */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={application?.jobInfo?.jobTitle || ""}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-not-allowed"
                  />
                </motion.div>

                {/* Date & Time */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    required
                  />
                </motion.div>

                {/* Meeting Link */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Link2 className="inline w-4 h-4 mr-1" />
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    required
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  className="pt-4"
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      "Schedule Interview"
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewForm;
