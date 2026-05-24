import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiCpu,
  FiBookOpen,
  FiAward,
  FiEdit2,
} from "react-icons/fi";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const sectionVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [currentSection, setCurrentSection] = useState(0);

  // Determine user role and profile completion
  const userRole = user?.role;
  const isProfileComplete = user?.profileCompleted || false;

  // Only show warning for job seekers with incomplete profile
  const showWarning =
    userRole !== "Employer" && userRole !== "Admin" && !isProfileComplete;

  // Define sections with their content
  const sections = [
    {
      title: "Basic Information",
      icon: <FiUser className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <ProfileField
            icon={<FiUser />}
            label="Full Name"
            value={user?.name}
          />
          <ProfileField icon={<FiMail />} label="Email" value={user?.email} />
          <ProfileField icon={<FiPhone />} label="Phone" value={user?.phone} />
          <ProfileField
            icon={<FiMapPin />}
            label="Address"
            value={user?.address}
          />
          <ProfileField
            icon={<FiBriefcase />}
            label="Role"
            value={user?.role}
          />
          <ProfileField
            icon={<FiCalendar />}
            label="Member Since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null
            }
          />
        </div>
      ),
    },
    {
      title: "Skills",
      icon: <FiCpu className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          {user?.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No skills added</p>
          )}
        </div>
      ),
    },
    {
      title: "Education",
      icon: <FiBookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <ProfileField
            label="Qualification"
            value={user?.education?.qualification}
          />
          <ProfileField
            label="College / Institute"
            value={user?.education?.college}
          />
          <ProfileField
            label="Graduation Year"
            value={user?.education?.graduationYear}
          />
        </div>
      ),
    },
    {
      title: "Experience",
      icon: <FiAward className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <ProfileField
            label="Experience Level"
            value={user?.experienceLevel}
          />
          <ProfileField
            label="Years of Experience"
            value={user?.yearsOfExperience}
          />
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
            <p className="text-gray-800 whitespace-pre-wrap">
              {user?.bio || "Not provided"}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const goToNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Warning - only for job seekers with incomplete profile */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-red-50 text-red-800 border border-red-200"
          >
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <p className="font-medium">
              Your profile is incomplete. Complete all sections to unlock more
              opportunities.
            </p>
          </motion.div>
        )}

        {/* Section Title with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white rounded-lg">
            {sections[currentSection].icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {sections[currentSection].title}
          </h2>
        </div>

        {/* Section Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6"
          >
            {sections[currentSection].content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - always visible */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={goToPrevious}
            disabled={currentSection === 0}
            variant="outline"
            className="flex-1 py-6 text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </Button>
          <Button
            onClick={goToNext}
            disabled={currentSection === sections.length - 1}
            className="flex-1 py-6 bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white hover:from-[#204674] hover:to-[#1B1D3E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reusable field component
const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
    {icon && (
      <span className="text-blue-600 bg-blue-50 p-2 rounded-lg">{icon}</span>
    )}
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-base ${value ? "text-gray-800" : "text-gray-400 italic"}`}
      >
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

export default MyProfile;
