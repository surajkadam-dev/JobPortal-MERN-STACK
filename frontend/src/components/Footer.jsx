import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";
import {
  FaYoutube,
  FaLinkedin,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaHome,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const socialLinks = [
    { icon: <FaSquareInstagram />, color: "text-pink-500", label: "Instagram" },
    { icon: <FaSquareXTwitter />, color: "text-black", label: "Twitter" },
    { icon: <FaYoutube />, color: "text-red-600", label: "YouTube" },
    { icon: <FaLinkedin />, color: "text-blue-600", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div className="mb-8 md:mb-0">
          <h1 className="text-3xl font-bold text-blue-600">JobPortal</h1>
          <p className="mt-4 text-gray-600">
            Connecting talent with opportunity
          </p>
        </div>

        {/* Support Section */}
        <div className="mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <FaMapMarkerAlt className="mr-2 text-blue-600" />
            Support
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start text-gray-600 hover:text-gray-900 transition-colors">
              <FiMapPin className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
              <span>
                Street 007, Shivchaya Kannamwar Nagar 2, Vikhroli Mumbai
              </span>
            </li>
            <li className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <FiMail className="mr-2 text-blue-600" />
              surajkadam1706004@gmail.com
            </li>
            <li className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <FiPhone className="mr-2 text-blue-600" />
              +91 93218 03014
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <FaBriefcase className="mr-2 text-blue-600" />
            Quick Links
          </h2>
          <ul className="space-y-3">
            <li className="hover:text-blue-600 transition-colors">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <FaHome className="mr-2" />
                Home
              </Link>
            </li>
            <li className="hover:text-blue-600 transition-colors">
              <Link
                to="/jobs"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <FaBriefcase className="mr-2" />
                Jobs
              </Link>
            </li>
            {isAuthenticated && (
              <li className="hover:text-blue-600 transition-colors">
                <Link
                  to="/dashboard"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <FaUser className="mr-2" />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <FaUser className="mr-2 text-blue-600" />
            Follow Us
          </h2>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href="#"
                className={`text-2xl text-gray-600 hover:${social.color} transition-all hover:scale-110`}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
        <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
