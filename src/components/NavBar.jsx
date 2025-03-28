import { useState } from "react";
import { logo, profile } from "../main";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/academies", label: "Academies" },
    { path: "/about", label: "About Us" },
    { path: "/login", label: "Login" },
    { path: "/signup", label: "SignUp" },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-white shadow-md w-full sticky top-0 z-50 " // Changed fixed to sticky, added mb-8
    >
      <div className="container mx-auto px-4 py-3 md:py-0">
        <div className="flex items-center justify-between h-16 md:h-24">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-10 md:h-14 w-auto transition-all duration-300"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm lg:text-base font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-teal-700 bg-teal-50"
                        : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Profile Button - Desktop */}
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors duration-300"
            >
              <span>Log in/Sign up</span>
              <img
                src={profile}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleMobileMenu}
              className="text-teal-700 hover:text-teal-900 focus:outline-none"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={navItemVariants}>
                  <NavLink
                    to={link.path}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? "bg-teal-50 text-teal-700"
                          : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div variants={navItemVariants} className="pt-2">
                <Link
                  to="/profile"
                  onClick={toggleMobileMenu}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium bg-teal-100 text-teal-800 hover:bg-teal-200"
                >
                  <span>Profile</span>
                  <img
                    src={profile}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default NavBar;
