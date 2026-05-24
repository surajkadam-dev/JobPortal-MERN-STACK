import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSavedJobs } from "../store/slices/userSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  BookmarkCheck,
  ArrowRight,
} from "lucide-react";

// Skeleton component for loading state
const JobCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </div>
    <div className="flex justify-between gap-2">
      <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
    </div>
  </div>
);

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSavedJobs());
  }, [dispatch]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-[#1B1D3E] text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Saved Jobs
              </h1>
              <p className="text-indigo-200 text-lg">
                {savedJobs?.length || 0} jobs saved for later
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all backdrop-blur-sm border border-white/20 w-fit"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          // Skeleton grid
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <JobCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : savedJobs && savedJobs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {savedJobs.map((job) => (
              <motion.div
                key={job._id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  {/* Header with company info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1B1D3E]/10 rounded-xl flex items-center justify-center text-[#1B1D3E] font-bold text-lg">
                        {job.companyName?.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {job.companyName}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </p>
                      </div>
                    </div>
                    <BookmarkCheck className="w-5 h-5 text-[#1B1D3E] fill-current" />
                  </div>

                  {/* Job Title */}
                  <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1B1D3E] transition-colors">
                    {job.title}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.introduction}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#1B1D3E]/10 text-[#1B1D3E] rounded-full text-xs font-medium">
                      {job.positions}{" "}
                      {job.positions > 1 ? "Positions" : "Position"}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {job.jobType}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      ₹{job.salary}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/job/${job._id}`}
                      className="flex-1 text-center py-2.5 border-2 border-[#1B1D3E] text-[#1B1D3E] rounded-xl font-semibold hover:bg-[#1B1D3E] hover:text-white transition-colors"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/post/application/${job._id}`}
                      className="flex-1 text-center py-2.5 bg-[#1B1D3E] text-white rounded-xl font-semibold hover:bg-[#2a2c4a] transition-colors"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex p-4 bg-[#1B1D3E]/10 rounded-full mb-4">
              <BookmarkCheck className="w-12 h-12 text-[#1B1D3E]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring jobs and save the ones you like.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-[#1B1D3E] text-white px-6 py-3 rounded-xl hover:bg-[#2a2c4a] transition-colors"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
