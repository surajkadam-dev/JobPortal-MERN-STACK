import { Input } from "@/components/ui/input";
import { clearAllUserErrors, register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Shield, User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const [role, setRole] = useState("Job Seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [phoneError, setPhoneError] = useState("");

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
  ];

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  const validatePhone = () => {
    if (phoneCountryCode === "+91") {
      const isValid = /^[6-9]\d{9}$/.test(phoneNumber);
      if (!isValid) {
        setPhoneError("Enter a valid 10-digit Indian mobile number");
        return false;
      }
    } else {
      if (phoneNumber.length < 4) {
        setPhoneError("Enter a valid phone number");
        return false;
      }
    }
    setPhoneError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePhone()) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    const fullAddress =
      `${addressLine}, ${city}, ${state}, ${country} - ${zipCode}`
        .replace(/,\s*,/g, ",")
        .replace(/,\s*$/g, "");

    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", `${phoneCountryCode} ${phoneNumber}`);
    formData.append("address", fullAddress);
    formData.append("password", password);
    if (role === "Admin") {
      formData.append("secretKey", secretKey);
    }

    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
      toast.success("User registered successfully");
    }
  }, [dispatch, isAuthenticated, navigateTo]);

  const getRoleIcon = () => {
    switch (role) {
      case "Admin":
        return <Shield className="w-5 h-5" />;
      case "Employer":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Left Panel - Branding */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-2/5 bg-blue-50 p-8 lg:p-12 text-gray-800 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Subtle background blobs */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              {/* Logo */}
              <div className="flex items-center space-x-2 text-blue-600 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">JobPortal</span>
              </div>

              <h2 className="text-4xl font-bold mb-4 leading-tight text-gray-800">
                Welcome to JobPortal
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Your trusted platform for career growth. Join thousands of
                professionals and companies.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span>Secure & encrypted data</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span>Connect with top employers</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span>Personalized job matches</span>
              </div>
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-10 mt-8 lg:mt-0"
          >
            <p className="text-sm text-gray-500 italic">
              "Found my dream job within a week. Best platform!"
            </p>
            <p className="text-sm font-semibold text-gray-700 mt-2">
              — Priya Sharma
            </p>
          </motion.div>
        </motion.div>

        {/* Right Panel - Registration Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-3/5 p-8 lg:p-12"
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 text-blue-600 shadow-sm"
              >
                {getRoleIcon()}
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600">
                {role === "Job Seeker" && "Find your dream job"}
                {role === "Employer" && "Hire the best talent"}
                {role === "Admin" && "Manage the platform"}
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Role Selector */}
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  I am a
                </Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                >
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employer">Employer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="flex gap-2">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => {
                      setPhoneCountryCode(e.target.value);
                      setPhoneError("");
                    }}
                    className="w-28 border border-gray-300 rounded-lg px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="tel"
                    placeholder={
                      phoneCountryCode === "+91" ? "9876543210" : "Phone number"
                    }
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ""));
                      setPhoneError("");
                    }}
                    required
                    className="flex-1 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              {/* Address Fields */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Input
                  placeholder="Street address"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full focus:ring-blue-600 focus:border-blue-600"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="focus:ring-blue-600 focus:border-blue-600"
                  />
                  <Input
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="focus:ring-blue-600 focus:border-blue-600"
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`w-full pr-10 focus:ring-blue-600 focus:border-blue-600 ${
                        !passwordMatch && confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {!passwordMatch && confirmPassword && (
                    <p className="text-red-500 text-sm">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              {/* Admin secret key */}
              {role === "Admin" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="secretKey"
                    className="text-sm font-medium text-gray-700"
                  >
                    Admin Secret Key *
                  </Label>
                  <Input
                    id="secretKey"
                    type="password"
                    placeholder="Enter secret key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                    className="w-full focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || (!passwordMatch && confirmPassword)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-[1.02] py-3 rounded-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  `Sign up as ${role}`
                )}
              </Button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
