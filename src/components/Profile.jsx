import { useLocation, useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
// import { motion as m } from "framer-motion";

import { useFormik } from "formik";
import "./Profile.css";
function Profile() {
  const profileData = useLocation();

  const router = useNavigate();
  const formik = useFormik({
    initialValues: { name: "", email: "" },
    onSubmit: (values) => {
      console.log(values);
      router("/profile", { state: { values } });
    },
  });
  // Name:{profileData.state.firstName}
  return (
    <main className="profile">
      <aside className=" bg-gradient-to-b from-yellow-500 to-blue-400">
        <button className="text-5xl pl-4 pt-4">
          <GoArrowLeft className="text-white" />
        </button>
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
      <form onSubmit={formik.handleSubmit} className="user-form w-full ">
        <div className="change-account">
          <h2 className="text-3xl mb-6 inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-400">
            YOUR ACCOUNT SETTINGS
          </h2>
          <div className="grid w-2/5 mb-4">
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
          <div className="grid w-2/5 ">
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
              required=""
              capture
            />
          </div>
          <div className="flex justify-end pr-14 ">
            <button
              type="submit"
              className="btn rounded-tl-full hover:cursor-pointer text-base "
              itemType="button"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="change-password">
          <h2 className="text-3xl mb-6 inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-400">
            PASSWORD CHANGE
          </h2>
          <div className="grid w-2/5 mb-4">
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
          <div className="grid w-2/5 mb-4">
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
          <div className="grid w-2/5 ">
            <label className="block">Confirm Password</label>
            <input
              onChange={formik.handleChange}
              className="input-container"
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
              className="btn rounded-tl-full hover:cursor-pointer text-base "
              itemType="button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default Profile;
