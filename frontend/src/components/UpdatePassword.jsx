import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  clearAllUpdateProfileErrors,
  updatePassword,
} from "../store/slices/updateProfileSlice";
import { getUser } from "../store/slices/userSlice";
import { FiLock } from "react-icons/fi";

const UpdatePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});

  const { loading, error, isUpdated } = useSelector(
    (state) => state.updateProfile,
  );
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!passwords.oldPassword)
      newErrors.oldPassword = "Current password is required";
    if (passwords.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (passwords.newPassword !== passwords.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("oldPassword", passwords.oldPassword);
    formData.append("newPassword", passwords.newPassword);
    formData.append("confirmPassword", passwords.confirmPassword);
    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Password updated successfully");
      dispatch(getUser());
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [dispatch, error, isUpdated]);

  const inputFields = [
    {
      label: "Current Password",
      name: "oldPassword",
      type: showPassword.old ? "text" : "password",
      toggle: "old",
    },
    {
      label: "New Password",
      name: "newPassword",
      type: showPassword.new ? "text" : "password",
      toggle: "new",
    },
    {
      label: "Confirm New Password",
      name: "confirmPassword",
      type: showPassword.confirm ? "text" : "password",
      toggle: "confirm",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Update Password
        </h2>
        <p className="text-gray-600">
          Secure your account by updating your password regularly
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FiLock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Password Requirements
            </h3>
            <p className="text-sm text-gray-500">
              Your new password must be at least 6 characters long
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          {inputFields.map((field, index) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  value={passwords[field.name]}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      [field.name]: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors[field.name]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  } focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors`}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      [field.toggle]: !showPassword[field.toggle],
                    })
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword[field.toggle] ? (
                    <FaRegEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors[field.name] && (
                <p className="text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating Password...
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Password Security Tips:
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg
                className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Use a combination of letters, numbers, and special characters
            </li>
            <li className="flex items-start">
              <svg
                className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Avoid using personal information like birthdays or names
            </li>
            <li className="flex items-start">
              <svg
                className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Update your password every 90 days for maximum security
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdatePassword;
