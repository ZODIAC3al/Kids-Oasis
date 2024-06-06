import { useLocation, useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
// import { motion as m } from "framer-motion";

import { useFormik } from "formik";
import "./Profile.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
function Profile() {
  const profileData = useLocation();
  const router = useNavigate();

  const [image, setImage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const nav = {
    backgroundColor: "black",
  };
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsClicked((e) => !e);
  };

  const formik2 = useFormik({
    initialValues: { currentPassword: "", password: "", passwordConfirm: "" },
    onSubmit: (values) => {
      axios
        .post(
          `https://kids-oasis-smti.onrender.com/api/v1/users/updateMyPassword`,
          values
        )
        .then((res) => {
          console.log(res.data);
          const token = res.data.token;

          document.cookie = `authToken=${token}; path=/`;
          localStorage.setItem("authToken", token);
          router("/login", { state: { values } });
        })
        .catch((err) => console.log(err));
    },
  });

  // const router = useNavigate();
  const formik = useFormik({
    initialValues: { photo: "", name: "", email: "" },
    onChange: (e) => {
      console.log(e.target.files);
      setImage(e.target.files[0]);
    },
    onSubmit: (values) => {
      function handleApi() {
        const formData = new FormData();
        formData.append("image", image);
        axios.post("url", formData).then((res) => {
          `https://kids-oasis-smti.onrender.com/api/v1/users/updateMe`, res;
        });
      }

      axios
        .post(
          `https://kids-oasis-smti.onrender.com/api/v1/users/resetPassword`,
          values
        )
        .then((res) => {
          console.log(res.data);
          const token = res.data.token;

          document.cookie = `authToken=${token}; path=/`;
          localStorage.setItem("authToken", token);
          router("/login", { state: { values } });
        })
        .catch((err) => console.log(err));
    },
  });
  // Name:{profileData.state.firstName}
  return (
    <main className=" profile  relative ">
      <nav className="profile-navigation flex justify-between  lg:hidden md:hidden sm:block">
        <Link to="/" className="text-4xl pl-4 pt-4">
          <GoArrowLeft className="text-green-800" />
        </Link>
        <button
          className={` md:hidden text-green-800 text-3xl  z-10`}
          onClick={handleMobileMenuToggle}
        >
          ☰
        </button>
        {/* Navigation Links */}
        <div
          className={`text-gray-500  md:w-auto md:flex md:items-center order-3 md:order-2 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col  bg-black bg-opacity-20 md:flex-row absolute left-1/3 top-1/3 font-semibold md:pr-12 md:justify-between lg:w-full lg:gap-4 md:gap-2">
            {[
              "Home",
              "Academies",
              "About Us",
              "Login",
              "SignUp",
              "Profile",
            ].map((link, index) => (
              <NavLink
                key={index}
                to={`/${link.replace(/\s+/g, "").toLowerCase()}`}
                className="text-black sm:z-50 hover:text-teal-700 block rounded-md px-2 py-2 text-lg md:text-xs font-medium"
              >
                {link}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <aside className="profile-sidebar bg-gradient-to-b from-yellow-500 to-blue-400">
        <Link to="/" className="text-5xl pl-4 pt-4">
          <GoArrowLeft className="text-white" />
        </Link>
        <div className="user-container flex align-middle gap-4 mt-6 py-4">
          <div className="user-image rounded-full"></div>
          <label htmlFor="file-upload" className="user-name my-auto ">
            User Name
          </label>
          <input
            id="file-upload"
            type="file"
            name="profile_photo"
            placeholder="Photo"
            className=" my-auto"
            required=""
            capture
          />
        </div>
      </aside>
      <div className="user-form w-full ">
        <form onSubmit={formik.handleSubmit}>
          <div className="change-account">
            <h2 className="text-2xl mb-6 inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-400">
              YOUR ACCOUNT SETTINGS
            </h2>
            <div className="grid lg:w-2/5 md:w-2/5 mb-4">
              <label className="block">Name</label>
              <input
                onChange={formik.handleChange}
                className="input-container"
                placeholder="User Name"
                type="text"
                name="name"
                value={formik.values.name}
                required
              />
            </div>
            <div className="grid lg:w-2/5 md:w-2/5 ">
              <label className="block">Email Address</label>
              <input
                onChange={formik.handleChange}
                className="input-container"
                placeholder="Enter your email"
                type="email"
                name="email"
                value={formik.values.email}
                required
              />
            </div>
            <div className="flex align-middle gap-4 mt-6 py-4">
              <div className="user-image rounded-full"></div>
              <label
                htmlFor="file-upload"
                className="custom-file-upload my-auto "
              >
                Choose new Photo
              </label>
              <input
                id="file-upload"
                type="file"
                name="profile_photo"
                placeholder="Photo"
                className=" my-auto"
                onChange={formik.handleChange}
                required=""
                capture
              />
            </div>
            <div className="flex justify-end pr-14 ">
              <button
                type="submit"
                className="btn rounded-tl-full hover:cursor-pointer text-sm "
                itemType="button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
        <form>
          <div className="change-password">
            <h2 className="text-2xl mb-6 inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-400">
              PASSWORD CHANGE
            </h2>
            <div className="grid lg:w-2/5 md:w-2/5 sm:w-3/5 mb-4">
              <label className="block">Current Password</label>
              <input
                onChange={formik.handleChange}
                className="input-container"
                placeholder="current password"
                type="password"
                name="password"
                value={formik.values.password}
                required
              />
            </div>
            <div className="grid lg:w-2/5 md:w-2/5 mb-4">
              <label className="block">New Password</label>
              <input
                onChange={formik.handleChange}
                className="input-container"
                placeholder="new password"
                type="password"
                name="newPassword"
                value={formik.values.newPassword}
                required
              />
            </div>
            <div className="grid lg:w-2/5 md:w-2/5 ">
              <label className="block">Confirm Password</label>
              <input
                onChange={formik.handleChange}
                className="input-container mb-8"
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                required
              />
            </div>

            <div className="flex justify-end pr-14 ">
              <button
                type="submit"
                className="btn rounded-tl-full hover:cursor-pointer text-sm "
                itemType="button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Profile;
