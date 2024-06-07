import { useState } from "react";
import { logo, profile } from "../main";
import { Link, NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <section className="container mx-auto h-16 md:h-32 shadow-gray-300">
      <nav className="shadow w-full px-4 md:px-8 md:py-8 m-auto">
        <div className="md:h-16 h-16 md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
          <div className="order-1 w-16 h-16 md:w-32 md:h-32 flex justify-center items-center">
            <img src={logo} className="h-12 md:h-20" alt="logo" />
          </div>

          <button
            className="md:hidden text-green-800 text-3xl z-10"
            onClick={handleMobileMenuToggle}
          >
            ☰
          </button>

          <div
            className={`text-gray-500 md:w-auto md:flex md:items-center order-3 md:order-2 ${
              isMobileMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="navbar-links flex flex-col text-center md:bg-transparent lg:bg-transparent sm:bg-black sm:bg-opacity-20 md:flex-row font-semibold md:pr-12 md:justify-between lg:w-full lg:gap-4 md:gap-2">
              <NavLink
                to="/"
                className="text-black sm:z-50 hover:text-teal-700 block rounded-md px-2 py-2 text-lg md:text-xs font-medium"
              >
                Home
              </NavLink>
              <NavLink
                to="/academies"
                className="text-black sm:z-50 hover:text-teal-700 block rounded-md px-2 py-2 text-lg md:text-xs font-medium"
              >
                Academies
              </NavLink>
              <NavLink
                to="/about"
                className="text-black sm:z-50 hover:text-teal-700 block rounded-md px-2 py-2 text-lg md:text-xs font-medium"
              >
                About Us
              </NavLink>
              <NavLink
                to="/login"
                className="text-black sm:z-50 hover:text-teal-700 block rounded-md px-2 py-2 text-lg md:text-xs font-medium"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="text-black sm:z-50 hover:text-teal-700 block rounded-md px-2 py-2 text-lg md:text-xs font-medium"
              >
                SignUp
              </NavLink>
              <NavLink
                to="/profile"
                className="text-black sm:z-50 hover:text-teal-700 block rounded-md px-2 py-2 text-lg md:text-xs font-medium"
              >
                Profile
              </NavLink>
            </div>
          </div>
          {/* Profile Button */}
          <div className="order-2 md:order-3">
            <Link
              to="/profile"
              className="h-auto w-auto px-4 py-2 bg-slate-200 text-black block rounded-3xl flex items-center gap-2"
            >
              <span className="hidden md:block md:text-xs lg:text-base">
                Log in/Sign up
              </span>
              <span className="block md:hidden text-xs">Register</span>
              <img className="w-6 md:w-7" src={profile} alt="profile" />
            </Link>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default NavBar;
