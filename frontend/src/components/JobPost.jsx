import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllJobErrors,
  postJob,
  resetJobSlice,
} from "../store/slices/jobSlice";
import {
  Briefcase,
  MapPin,
  Building2,
  IndianRupee,
  Calendar,
  Users,
  Tag,
  FileText,
  GraduationCap,
  Gift,
  Link as LinkIcon,
  Globe,
  Cpu,
} from "lucide-react";

const JobPost = () => {
  const dispatch = useDispatch();
  const { error, message, loading } = useSelector((state) => state.jobs);

  const [formData, setFormData] = useState({
    title: "",
    jobType: "",
    location: "",
    companyName: "",
    introduction: "",
    responsibilities: "",
    qualifications: "",
    offers: "",
    salary: "",
    hiringMultipleCandidates: "No",
    personalWebsiteTitle: "",
    personalWebsiteUrl: "",
    jobNiche: "",
    validityPeriod: "",
    requiredSkills: "",
  });

  // For skills array (converted from comma-separated string)
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
      // Reset form
      setFormData({
        title: "",
        jobType: "",
        location: "",
        companyName: "",
        introduction: "",
        responsibilities: "",
        qualifications: "",
        offers: "",
        salary: "",
        hiringMultipleCandidates: "No",
        personalWebsiteTitle: "",
        personalWebsiteUrl: "",
        jobNiche: "",
        validityPeriod: "",
        requiredSkills: "",
      });
      setSkillsInput("");
    }
  }, [error, message, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
    setFormData((prev) => ({ ...prev, requiredSkills: e.target.value }));
  };

  // Calculate expiry date based on validity period
  const calculateExpireDate = (validity) => {
    const expireDate = new Date();
    if (validity === "3-month") {
      expireDate.setMonth(expireDate.getMonth() + 3);
    } else if (validity === "6-month") {
      expireDate.setMonth(expireDate.getMonth() + 6);
    } else if (validity === "1-year") {
      expireDate.setFullYear(expireDate.getFullYear() + 1);
    }
    return expireDate.toISOString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.validityPeriod) {
      toast.error("Please select job validity period.");
      return;
    }

    // Convert skills string to array
    const skillsArray = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const jobData = {
      ...formData,
      requiredSkills: skillsArray,
      expiryDate: calculateExpireDate(formData.validityPeriod),
    };

    dispatch(postJob(jobData));
  };

  // Field groups for better organization
  const sections = [
    {
      title: "Basic Information",
      icon: <Briefcase className="w-5 h-5" />,
      fields: [
        {
          name: "title",
          label: "Job Title",
          type: "text",
          required: true,
          icon: <Briefcase />,
        },
        {
          name: "jobType",
          label: "Job Type",
          type: "select",
          options: ["Full-time", "Part-time", "Contract", "Internship"],
          required: true,
          icon: <Briefcase />,
        },
        {
          name: "location",
          label: "Location",
          type: "text",
          required: true,
          icon: <MapPin />,
        },
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
          required: true,
          icon: <Building2 />,
        },
        {
          name: "jobNiche",
          label: "Job Niche (e.g., Technology, Marketing)",
          type: "text",
          required: true,
          icon: <Tag />,
        },
      ],
    },
    {
      title: "Compensation & Duration",
      icon: <IndianRupee className="w-5 h-5" />,
      fields: [
        {
          name: "salary",
          label: "Salary (LPA)",
          type: "text",
          placeholder: "e.g., 4-5 LPA",
          required: true,
          icon: <IndianRupee />,
        },
        {
          name: "validityPeriod",
          label: "Job Validity",
          type: "select",
          options: ["3-month", "6-month", "1-year"],
          required: true,
          icon: <Calendar />,
        },
        {
          name: "hiringMultipleCandidates",
          label: "Hiring Multiple Candidates?",
          type: "select",
          options: ["No", "Yes"],
          required: true,
          icon: <Users />,
        },
      ],
    },
    {
      title: "Description",
      icon: <FileText className="w-5 h-5" />,
      fields: [
        {
          name: "introduction",
          label: "Job Introduction",
          type: "textarea",
          rows: 4,
          required: true,
          icon: <FileText />,
        },
        {
          name: "responsibilities",
          label: "Responsibilities",
          type: "textarea",
          rows: 4,
          required: true,
          icon: <FileText />,
        },
        {
          name: "qualifications",
          label: "Qualifications",
          type: "textarea",
          rows: 4,
          required: true,
          icon: <GraduationCap />,
        },
        {
          name: "offers",
          label: "What We Offer (Benefits, Perks)",
          type: "textarea",
          rows: 3,
          required: false,
          icon: <Gift />,
        },
      ],
    },
    {
      title: "Skills & Website",
      icon: <Cpu className="w-5 h-5" />,
      fields: [
        {
          name: "requiredSkills",
          label: "Required Skills (comma separated)",
          type: "text",
          placeholder: "e.g., JavaScript, React, Node.js",
          required: true,
          icon: <Cpu />,
        },
        {
          name: "personalWebsiteTitle",
          label: "Website Title (e.g., Company Blog)",
          type: "text",
          required: false,
          icon: <Globe />,
        },
        {
          name: "personalWebsiteUrl",
          label: "Website URL",
          type: "url",
          placeholder: "https://example.com",
          required: false,
          icon: <LinkIcon />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B1D3E] to-[#204674] px-6 py-5">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Post a New Job
            </h1>
            <p className="text-blue-100 mt-1 text-sm">
              Fill in the details below to attract the best candidates.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-5 border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-4 text-[#1B1D3E]">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.fields.map((field) => {
                    const value =
                      field.name === "requiredSkills"
                        ? skillsInput
                        : formData[field.name];

                    if (field.type === "textarea") {
                      return (
                        <div
                          key={field.name}
                          className="md:col-span-2 space-y-1.5"
                        >
                          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            {field.icon}
                            {field.label}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <textarea
                            name={field.name}
                            value={value}
                            onChange={handleChange}
                            rows={field.rows || 3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                            required={field.required}
                          />
                        </div>
                      );
                    } else if (field.type === "select") {
                      return (
                        <div key={field.name} className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            {field.icon}
                            {field.label}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <select
                            name={field.name}
                            value={value}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm appearance-none bg-white"
                            required={field.required}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    } else {
                      return (
                        <div key={field.name} className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            {field.icon}
                            {field.label}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={value}
                            onChange={
                              field.name === "requiredSkills"
                                ? handleSkillsChange
                                : handleChange
                            }
                            placeholder={field.placeholder || ""}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                            required={field.required}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-[#1B1D3E] to-[#204674] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPost;
