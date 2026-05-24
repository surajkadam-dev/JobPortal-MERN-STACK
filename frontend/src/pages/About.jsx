import React from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaUsers, FaRobot, FaChartLine } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800">
          About Our Job Portal
        </h1>
        <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
          Empowering job seekers and employers with an advanced AI-driven job
          portal.
        </p>
      </motion.div>

      {/* Feature Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-6 shadow-lg rounded-lg text-center"
        >
          <FaBriefcase className="text-4xl text-blue-500 mx-auto" />
          <h3 className="text-xl font-semibold mt-3">Wide Job Listings</h3>
          <p className="text-gray-600 mt-2">
            Browse thousands of job openings from top companies worldwide.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white p-6 shadow-lg rounded-lg text-center"
        >
          <FaUsers className="text-4xl text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold mt-3">Community & Networking</h3>
          <p className="text-gray-600 mt-2">
            Connect with professionals and grow your network effortlessly.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white p-6 shadow-lg rounded-lg text-center"
        >
          <FaRobot className="text-4xl text-purple-500 mx-auto" />
          <h3 className="text-xl font-semibold mt-3">AI-Powered Matching</h3>
          <p className="text-gray-600 mt-2">
            Our smart algorithms find the best job opportunities for you.
          </p>
        </motion.div>
      </div>

      <div className="mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center text-gray-800"
        >
          Additional Information
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-6 shadow-lg rounded-lg"
          >
            <FaChartLine className="text-4xl text-orange-500" />
            <h3 className="text-xl font-semibold mt-3">
              Real-Time Application Tracking
            </h3>
            <p className="text-gray-600 mt-2">
              Monitor your job applications and get instant updates on your
              status.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-6 shadow-lg rounded-lg"
          >
            <FaUsers className="text-4xl text-red-500" />
            <h3 className="text-xl font-semibold mt-3">
              Exclusive Career Insights & Tips
            </h3>
            <p className="text-gray-600 mt-2">
              Access expert advice, resume tips, and interview guidance to boost
              your career.
            </p>
          </motion.div>
        </div>
      </div>
      {/* Meet Our Team Section */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-gray-800">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          <motion.div
            className="p-6 bg-white shadow-lg rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaUsers className="text-4xl text-purple-600" />
            <h3 className="text-xl font-semibold mt-4">John Doe</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </motion.div>
          <motion.div
            className="p-6 bg-white shadow-lg rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaUsers className="text-4xl text-blue-600" />
            <h3 className="text-xl font-semibold mt-4">Jane Smith</h3>
            <p className="text-gray-600">Head of HR</p>
          </motion.div>
          <motion.div
            className="p-6 bg-white shadow-lg rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaUsers className="text-4xl text-green-600" />
            <h3 className="text-xl font-semibold mt-4">Michael Brown</h3>
            <p className="text-gray-600">Lead Developer</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
