import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMenuOpen(false);
  };

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  // Stagger children animations
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <nav className="bg-white text-gray-800 py-4 px-6 md:px-20 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
        Job<span className="text-blue-600">Portal</span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/jobs">Jobs</NavLink>
        <NavLink to="/browse">Browse</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>

      {/* Desktop Auth Section */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-sm"
            >
              Logout
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-blue-400/50 hover:ring-blue-400 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-white/90 backdrop-blur-md border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 truncate">
                  {user?.email}
                </p>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Dashboard
                </Link>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-sm"
            >
              Signup
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md md:hidden shadow-lg border-t border-gray-200"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-6">
              {/* Navigation Links */}
              <motion.div
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
                className="flex flex-col gap-4"
              >
                <motion.div variants={itemVariants}>
                  <NavLinkMobile to="/" onClick={() => setMenuOpen(false)}>
                    Home
                  </NavLinkMobile>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NavLinkMobile to="/jobs" onClick={() => setMenuOpen(false)}>
                    Jobs
                  </NavLinkMobile>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NavLinkMobile
                    to="/browse"
                    onClick={() => setMenuOpen(false)}
                  >
                    Browse
                  </NavLinkMobile>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <NavLinkMobile to="/about" onClick={() => setMenuOpen(false)}>
                    About
                  </NavLinkMobile>
                </motion.div>
              </motion.div>

              {/* Auth Section Mobile */}
              <motion.div
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                  },
                }}
                className="flex flex-col gap-3 pt-4 border-t border-gray-200"
              >
                {isAuthenticated ? (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-all"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-all"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 text-center py-3 rounded-lg font-medium transition-all"
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-all"
                      >
                        Signup
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Reusable desktop nav link component with hover animation
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
  </Link>
);

// Reusable mobile nav link component
const NavLinkMobile = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-gray-700 hover:text-blue-600 text-lg font-medium py-2 transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
