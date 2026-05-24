import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { clearAllJobErrors, fetchJobs } from "../store/slices/jobSlice";
import { saveJob, unsaveJob } from "@/store/slices/userSlice";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Filter,
  X,
  ChevronDown,
  Search,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import NoJobsFound from "@/components/NoJobsFound";

const Jobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const filterPanelRef = useRef(null);
  const cityDropdownRef = useRef(null);

  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { savedJobs, isAuthenticated } = useSelector((state) => state.user);

  const cities = [
    { value: "all", label: "All Cities" },
    { value: "Bengaluru", label: "Bengaluru" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Pune", label: "Pune" },
    { value: "Chennai", label: "Chennai" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Noida", label: "Noida" },
    { value: "Gurgaon", label: "Gurgaon" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Ahmedabad", label: "Ahmedabad" },
  ];

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target)
      ) {
        setShowFilterPanel(false);
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close city dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideCity = (event) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideCity);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideCity);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -4, transition: { type: "spring", stiffness: 300 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.2 },
    },
    exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(fetchJobs({ city, searchKeyword }));
  }, [dispatch, city, searchKeyword]);

  const handleSearch = () => {
    dispatch(fetchJobs({ city, searchKeyword }));
  };

  const handleCityChange = (cityValue) => {
    if (cityValue === "all") {
      setCity("");
      setSelectedCity("");
    } else {
      setCity(cityValue);
      setSelectedCity(cityValue);
    }
    setCityDropdownOpen(false);
    setShowFilterPanel(false);
  };

  const handleDetails = (jobId) => navigate(`/job/${jobId}`);

  const handleSaveJob = (jobId) => {
    if (!isAuthenticated) return toast.error("Please login to save jobs");
    savedJobs.includes(jobId)
      ? dispatch(unsaveJob(jobId))
      : dispatch(saveJob(jobId));
  };

  const clearCityFilter = () => {
    setCity("");
    setSelectedCity("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section - Compact */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-gray-50 border-b border-gray-200 py-8 md:py-12"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Find Your <span className="text-blue-600">Dream Job</span>
            </h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Explore opportunities tailored to you
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
              <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-1.5">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg transition-all"
              >
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="container mx-auto px-2 sm:px-4 py-8">
        {/* Top Bar: Title and Filter Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedCity ? `Jobs in ${selectedCity}` : "All Jobs"}
          </h2>
          <div className="relative" ref={filterPanelRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
            >
              <Filter className="h-4 w-4" />
              Filter
              {selectedCity && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5"
                >
                  1
                </Badge>
              )}
            </Button>

            {/* Filter Panel Dropdown */}
            <AnimatePresence>
              {showFilterPanel && (
                <motion.div
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-72 min-h-[250px] bg-white rounded-xl shadow-lg border border-gray-200 z-20"
                >
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Filters</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowFilterPanel(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* City Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Location
                      </h4>
                      <div className="relative" ref={cityDropdownRef}>
                        <button
                          onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                          className="w-full flex items-center justify-between border border-gray-300 hover:border-blue-500 bg-white rounded-lg px-3 py-2 text-sm transition-all"
                        >
                          <span className="truncate">
                            {selectedCity
                              ? cities.find((c) => c.value === selectedCity)
                                  ?.label
                              : "All Cities"}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-gray-500 transition-transform ${
                              cityDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {cityDropdownOpen && (
                            <motion.div
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="absolute z-30 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                            >
                              <div className="max-h-48 overflow-y-auto py-0.5">
                                {cities.map((c) => (
                                  <button
                                    key={c.value}
                                    onClick={() => handleCityChange(c.value)}
                                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 transition-colors ${
                                      selectedCity === c.value
                                        ? "bg-blue-100 text-blue-900 font-medium"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {c.label}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => setShowFilterPanel(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filters Chips */}
        {selectedCity && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 flex items-center gap-1 px-3 py-1"
            >
              {selectedCity}
              <button
                onClick={clearCityFilter}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Job Grid - Full Width */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            <AnimatePresence>
              {jobs?.length > 0 ? (
                jobs.map((job) => (
                  <motion.article
                    key={job._id}
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all"
                  >
                    <div className="p-4 space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-10 h-10 rounded-lg border border-blue-100">
                            <AvatarImage
                              src={job.companyLogo || "/company_logo.jpeg"}
                            />
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              {job.companyName}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSaveJob(job._id)}
                          className="h-8 w-8 hover:bg-blue-50"
                        >
                          {savedJobs.includes(job._id) ? (
                            <BookmarkCheck className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Bookmark className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>

                      {/* Job Details */}
                      <div>
                        <h2 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">
                          {job.title}
                        </h2>
                        <p className="text-gray-600 line-clamp-2 text-xs mb-2">
                          {job.introduction}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5"
                          >
                            {job.jobType}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5"
                          >
                            {job.positions}{" "}
                            {job.positions > 1 ? "Positions" : "Position"}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5"
                          >
                            ₹{job.salary}
                          </Badge>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDetails(job._id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs h-8 px-2"
                        >
                          Details
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3"
                        >
                          <Link to={`/post/application/${job._id}`}>Apply</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full"
                >
                  <NoJobsFound onRetry={handleSearch} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default Jobs;
