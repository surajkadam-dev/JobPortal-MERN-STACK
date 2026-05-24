import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  updateProfile,
  clearAllUpdateProfileErrors,
  resetUpdateProfileState,
} from "@/store/slices/updateProfileSlice";
import { getUser } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Cpu,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  Upload,
  Eye,
} from "lucide-react";

const sectionVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated, message } = useSelector(
    (state) => state.updateProfile,
  );
  const dispatch = useDispatch();
  const [currentSection, setCurrentSection] = useState(0);

  // Track if form was actually submitted
  const formSubmitted = useRef(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    skills: user?.skills || [],
    education: {
      qualification: user?.education?.qualification || "",
      college: user?.education?.college || "",
      graduationYear: user?.education?.graduationYear || "",
    },
    experienceLevel: user?.experienceLevel || "",
    yearsOfExperience: user?.yearsOfExperience || "",
    bio: user?.bio || "",
  });

  const [skillsInput, setSkillsInput] = useState(formData.skills.join(", "));
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState(user?.resume?.url || "");
  const [errors, setErrors] = useState({});

  const experienceLevels = ["Fresher", "Experienced"];

  // Define sections based on role
  const userRole = user?.role; // expected values: "Jobseeker", "Employer", "Admin"

  // Basic info section (reused for employers/admins)
  const basicInfoSection = {
    title: "Basic Information",
    icon: <User className="w-5 h-5" />,
    fields: [
      {
        name: "name",
        label: "Full Name",
        icon: <User />,
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email Address",
        icon: <Mail />,
        type: "email",
        required: true,
      },
      { name: "phone", label: "Phone Number", icon: <Phone />, type: "tel" },
      { name: "address", label: "Address", icon: <MapPin />, type: "text" },
    ],
  };

  // Full sections for job seekers
  const fullSections = [
    basicInfoSection,
    {
      title: "Skills",
      icon: <Cpu className="w-5 h-5" />,
      fields: [
        {
          name: "skills",
          label: "Skills (comma separated)",
          icon: <Cpu />,
          type: "text",
          placeholder: "e.g. JavaScript, React, Node.js",
        },
      ],
    },
    {
      title: "Education",
      icon: <BookOpen className="w-5 h-5" />,
      fields: [
        {
          name: "qualification",
          label: "Qualification",
          icon: <BookOpen />,
          type: "text",
          section: "education",
        },
        {
          name: "college",
          label: "College / Institute",
          icon: <BookOpen />,
          type: "text",
          section: "education",
        },
        {
          name: "graduationYear",
          label: "Graduation Year",
          icon: <BookOpen />,
          type: "number",
          section: "education",
        },
      ],
    },
    {
      title: "Experience",
      icon: <Award className="w-5 h-5" />,
      fields: [
        {
          name: "experienceLevel",
          label: "Experience Level",
          icon: <Briefcase />,
          type: "select",
          options: experienceLevels,
        },
        {
          name: "bio",
          label: "Bio",
          icon: <FileText />,
          type: "textarea",
          rows: 4,
        },
      ],
    },
    {
      title: "Resume",
      icon: <FileText className="w-5 h-5" />,
      fields: [
        {
          name: "resume",
          label: "Upload Resume (PDF)",
          icon: <Upload />,
          type: "file",
        },
      ],
    },
  ];

  // Choose sections based on role
  const sections =
    userRole === "Employer" || userRole === "Admin"
      ? [basicInfoSection]
      : fullSections;

  // Reset current section if sections change (e.g., role changes)
  useEffect(() => {
    setCurrentSection(0);
  }, [sections.length]);

  // Reset update state on mount to clear any stale flags
  useEffect(() => {
    dispatch(clearAllUpdateProfileErrors());
  }, [dispatch]);

  // Prefill form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        skills: user.skills || [],
        education: {
          qualification: user.education?.qualification || "",
          college: user.education?.college || "",
          graduationYear: user.education?.graduationYear || "",
        },
        experienceLevel: user.experienceLevel || "",
        yearsOfExperience: user.yearsOfExperience || "",
        bio: user.bio || "",
      });
      setSkillsInput((user.skills || []).join(", "));
      setResumePreview(user?.resume?.url || "");
    }
  }, [user]);

  // Handle error and success toasts – only show success if form was submitted
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUpdateProfileState());
    }

    if (isUpdated && formSubmitted.current) {
      toast.success("Profile updated successfully");
      dispatch(getUser());
      dispatch(resetUpdateProfileState());
      formSubmitted.current = false; // reset flag
    }
  }, [error, isUpdated, dispatch]);

  const validateEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const handleChange = (e, fieldName, section = null) => {
    const value = e.target.value;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [fieldName]: value },
      }));
    } else if (fieldName === "skills") {
      setSkillsInput(value);
      const skillsArray = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, skills: skillsArray }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setResumePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const validateSection = (sectionIndex) => {
    const newErrors = {};
    const section = sections[sectionIndex];

    if (sectionIndex === 0) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email))
        newErrors.email = "Invalid email format";
    }
    // Add more validations as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePrevious = () => setCurrentSection((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmitted.current = true; // mark that we are submitting
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "education") {
        formPayload.append(
          "education[qualification]",
          value.qualification || "",
        );
        formPayload.append("education[college]", value.college || "");
        formPayload.append(
          "education[graduationYear]",
          value.graduationYear || "",
        );
      } else if (key === "skills") {
        value.forEach((skill) => formPayload.append("skills[]", skill));
      } else {
        formPayload.append(key, value);
      }
    });
    if (resume) formPayload.append("resume", resume);
    dispatch(updateProfile(formPayload));
  };

  const isProfileComplete = user?.profileCompleted || false;
  const showYearsField = formData.experienceLevel === "Experienced";

  // Determine if we should show the profile completion warning
  // Only show for job seekers (role not Employer/Admin) when profile is incomplete
  const showProfileWarning =
    userRole !== "Employer" && userRole !== "Admin" && !isProfileComplete;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Completion Warning - only for job seekers when incomplete */}
        {showProfileWarning && (
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

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white rounded-lg">
            {sections[currentSection]?.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {sections[currentSection]?.title}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()}>
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
              <div className="space-y-5">
                {sections[currentSection]?.fields.map((field) => {
                  // Special case: experienceLevel + conditional years field
                  if (field.name === "experienceLevel") {
                    return (
                      <React.Fragment key={field.name}>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-gray-600">
                            {field.icon}
                            {field.label}
                          </Label>
                          <select
                            value={formData.experienceLevel}
                            onChange={(e) => handleChange(e, "experienceLevel")}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                        {showYearsField && (
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-gray-600">
                              <Briefcase className="w-5 h-5" />
                              Years of Experience
                            </Label>
                            <Input
                              type="number"
                              value={formData.yearsOfExperience}
                              onChange={(e) =>
                                handleChange(e, "yearsOfExperience")
                              }
                              placeholder="e.g. 3"
                              className="w-full"
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  // Special case: resume upload
                  if (field.name === "resume") {
                    return (
                      <div key={field.name} className="space-y-2">
                        <Label className="flex items-center gap-2 text-gray-600">
                          {field.icon}
                          {field.label}
                        </Label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="hidden"
                              accept="application/pdf"
                            />
                            <div className="w-full p-3 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors text-center text-gray-600">
                              {resume ? resume.name : "Click to upload PDF"}
                            </div>
                          </label>
                          {resumePreview && (
                            <Link
                              to={resumePreview}
                              target="_blank"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Regular fields
                  const fieldName = field.name;
                  const fieldSection = field.section;
                  let value;
                  if (fieldSection) {
                    value = formData[fieldSection]?.[fieldName] || "";
                  } else if (fieldName === "skills") {
                    value = skillsInput;
                  } else {
                    value = formData[fieldName];
                  }

                  return (
                    <div key={fieldName} className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-600">
                        {field.icon}
                        {field.label}
                      </Label>
                      {field.type === "textarea" ? (
                        <textarea
                          rows={field.rows || 3}
                          value={value}
                          onChange={(e) =>
                            handleChange(e, fieldName, fieldSection)
                          }
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={value}
                          onChange={(e) =>
                            handleChange(e, fieldName, fieldSection)
                          }
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type={field.type}
                          value={value}
                          onChange={(e) =>
                            handleChange(e, fieldName, fieldSection)
                          }
                          placeholder={field.placeholder || ""}
                          className={`w-full ${
                            errors[fieldName] ? "border-red-500" : ""
                          }`}
                        />
                      )}
                      {errors[fieldName] && (
                        <p className="text-red-500 text-sm">
                          {errors[fieldName]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {currentSection > 0 && (
              <Button
                type="button"
                onClick={handlePrevious}
                variant="outline"
                className="flex-1 py-5"
              >
                ← Back
              </Button>
            )}

            {currentSection < sections.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 py-5"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-5"
              >
                {loading ? "Saving..." : "Finish & Save"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
