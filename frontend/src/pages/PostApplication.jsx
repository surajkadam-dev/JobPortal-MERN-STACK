import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  clearAllApplicationErrors,
  postApplication,
  resetApplicationSlice,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import { fetchSingleJob } from "../store/slices/jobSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Forbidden from "./Forbidden";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaFilePdf,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

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

const PostApplication = () => {
  const { singleJob } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector(
    (state) => state.applications,
  );

  const { jobId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  // Profile warning state
  const [showProfileWarning, setShowProfileWarning] = useState(false);
  const timerRef = useRef(null);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  // Check profile completion and set warning visibility
  useEffect(() => {
    if (user) {
      // Assuming user has a profileCompleted boolean field
      const profileCompleted = user.profileCompleted ?? false;
      if (!profileCompleted) {
        setShowProfileWarning(true);
      } else {
        setShowProfileWarning(false);
      }
    }
  }, [user]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handlePostApplication = (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please update your profile and upload your resume.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    dispatch(postApplication(formData, jobId));
  };

  const handleCloseWarning = () => {
    setShowProfileWarning(false);
    // Set timer to show warning again after 10 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Only show again if profile is still incomplete
      if (user && !user.profileCompleted) {
        setShowProfileWarning(true);
      }
    }, 10000); // 10 seconds
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");
      setResume(user.resume?.url || "");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      setTimeout(() => navigateTo("/dashboard"), 2000);
    }
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, error, message, jobId, user, navigateTo]);

  if (!isAuthenticated || user.role !== "Job Seeker") {
    return <Forbidden />;
  }

  const alreadyApplied = singleJob?.applicant?.includes(user._id);
  const profileCompleted = user.profileCompleted ?? false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12"
    >
      <div className="container mx-auto px-4">
        {/* Profile Warning Banner */}
        {showProfileWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto mb-6"
          >
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg shadow-md p-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-amber-600 text-xl mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800">
                    Profile Incomplete
                  </h4>
                  <p className="text-sm text-amber-700">
                    Your profile is incomplete. Please update your information
                    and upload your resume to apply for jobs.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseWarning}
                className="text-amber-600 hover:text-amber-800 transition"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          {/* Application Form */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-1 h-7 bg-[#1B1D3E] rounded-full mr-3"></span>
              Application Form
            </h2>

            <form onSubmit={handlePostApplication} className="space-y-5">
              {/* Job Title (disabled) */}
              <div>
                <Label
                  htmlFor="jobTitle"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={singleJob?.title || ""}
                  disabled
                  className="bg-gray-100 border-gray-200 text-gray-800 cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-gray-300 focus:ring-[#1B1D3E] focus:border-[#1B1D3E]"
                />
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:ring-[#1B1D3E] focus:border-[#1B1D3E]"
                />
              </div>

              {/* Phone */}
              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="border-gray-300 focus:ring-[#1B1D3E] focus:border-[#1B1D3E]"
                />
              </div>

              {/* Address */}
              <div>
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="border-gray-300 focus:ring-[#1B1D3E] focus:border-[#1B1D3E]"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <Label
                  htmlFor="coverLetter"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Cover Letter
                </Label>
                <textarea
                  id="coverLetter"
                  rows="5"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1B1D3E] focus:border-[#1B1D3E] outline-none transition"
                  placeholder="Tell us why you're a great fit..."
                />
              </div>

              {/* Resume */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Resume
                </Label>
                {resume ? (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FaFilePdf className="text-red-500 text-xl" />
                    <span className="text-sm text-gray-600 truncate flex-1">
                      {resume.split("/").pop()}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resume, "_blank")}
                      className="border-[#1B1D3E] text-[#1B1D3E] hover:bg-[#1B1D3E] hover:text-white"
                    >
                      Preview
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                    Please update your profile and upload your resume.
                  </p>
                )}
              </div>

              {/* Submit Button - hidden if profile incomplete */}
              {!profileCompleted ? (
                <div className="mt-6 p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                  <p className="font-medium">
                    Complete your profile to apply for this job.
                  </p>
                </div>
              ) : alreadyApplied ? (
                <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                  <p className="font-medium">
                    You have already applied for this position.
                  </p>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={loading || !resume}
                  className="w-full bg-[#1B1D3E] hover:bg-[#2a2c4a] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </form>
          </motion.div>

          {/* Job Summary */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-7 bg-[#1B1D3E] rounded-full mr-3"></span>
                Job Summary
              </h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-1">
                    {singleJob?.title}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaBuilding className="text-gray-400" />{" "}
                    {singleJob?.companyName}
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaMapMarkerAlt className="text-[#1B1D3E]" />
                      <span className="truncate">{singleJob?.location}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaMoneyBillWave className="text-[#1B1D3E]" />
                      <span className="truncate">
                        ₹{singleJob?.salary}/year
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaBriefcase className="text-[#1B1D3E]" />
                      <span>{singleJob?.jobType}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="font-medium">Positions:</span>
                      <span>{singleJob?.positions}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {singleJob?.introduction}
                  </p>
                </div>

                {/* Job Niche */}
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Job Niche
                  </h5>
                  <span className="inline-block px-3 py-1 bg-[#1B1D3E]/10 text-[#1B1D3E] rounded-full text-sm font-medium">
                    {singleJob?.jobNiche}
                  </span>
                </div>

                {/* Posted & Expiry */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <p className="text-xs text-gray-500">
                    Posted:{" "}
                    {singleJob?.jobPostedOn
                      ? new Date(singleJob.jobPostedOn).toDateString()
                      : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires:{" "}
                    {singleJob?.expiryDate
                      ? new Date(singleJob.expiryDate).toDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PostApplication;
