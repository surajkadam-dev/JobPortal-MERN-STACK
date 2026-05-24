// HeroSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import heroImage from "../assests/webizito-developer.png";
import { Search, Briefcase, Award } from "lucide-react";

const companies = [
  { name: "Google", logo: "G" },
  { name: "Airbnb", logo: "A" },
  { name: "Netflix", logo: "N" },
  { name: "Amazon", logo: "A" },
];

const HeroSection = ({ setSearchKeyword }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    setSearchKeyword(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Briefcase className="w-4 h-4" />
              <span>Over 3K+ jobs available</span>
            </motion.div>

            {/* Static Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Your Dream Job <br className="hidden lg:block" />
              <span className="text-blue-600">Anyone, Anywhere</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Discover thousands of job opportunities tailored to your skills
              and aspirations. Join a community of passionate professionals.
            </p>

            {/* Search Bar - Matches Jobs page */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto lg:mx-0">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, skill, or company"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white shadow-sm"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Find Now
              </button>
            </div>

            {/* Trusted by companies */}
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-3">
                Trusted by leading companies
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                {companies.map((company) => (
                  <div
                    key={company.name}
                    className="flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-sm font-bold text-gray-600">
                      {company.logo}
                    </div>
                    <span>{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image & Stats */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <img
                src={heroImage}
                alt="Professional working on laptop"
                className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl shadow-xl"
              />
            </motion.div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute top-8 left-0 lg:left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 border border-gray-200"
            >
              <div className="p-3 bg-blue-100 rounded-xl">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">3K+</p>
                <p className="text-sm text-gray-500">Jobs Done</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute bottom-8 right-0 lg:right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 border border-gray-200"
            >
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">12+</p>
                <p className="text-sm text-gray-500">Awards</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animation keyframes for background blobs */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 15s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
