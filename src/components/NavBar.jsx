import { logo } from "../main";
import { Link, NavLink } from "react-router-dom";
import { profile } from "../main";
import "./NavBar.css";
function NavBar() {
  return (
    <section className="container m-auto  shadow-gray-300 ">
      <nav className=" shadow  w-full px-8 py-8 md:px-auto m-auto  ">
        <div className="md:h-16 h-28  md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
          {/* Logo */}
          <div className="text-indigo-500 md:order-1 w-32 h-32 flex flex-col justify-center">
            {/* Heroicon - Chip Outline */}
            <img src={logo} alt="logo" />
          </div>
          {/* Navigation Links */}
          <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
            <div className="flex font-semibold justify-center md:justify-between w-full gap-4">
              <NavLink
                to="/"
                className="text-black hover:text-teal-700 block rounded-md px-3 py-2 text-base font-medium"
              >
                Home
              </NavLink>
              <NavLink
                to="/academies"
                className="text-black hover:text-teal-700 block rounded-md px-3 py-2 text-base font-medium"
              >
                Academies
              </NavLink>
              <NavLink
                to="/about"
                className="text-black hover:text-teal-700 block rounded-md px-3 py-2 text-base font-medium"
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                className="text-black hover:text-teal-700 block rounded-md px-3 py-2 text-base font-medium"
              >
                Contact Us
              </NavLink>
            </div>
          </div>
          {/* Profile Button */}
          <div className="order-2 md:order-3">
            <Link
              to="/profile"
              className="px-4 py-2 bg-slate-200  text-black rounded-3xl flex items-center gap-2"
            >
              <span>Log in/Sign up</span>
              <img src={profile} alt="profile" />
            </Link>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default NavBar;
