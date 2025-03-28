import { useLocation, useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const profileData = useLocation();
  const router = useNavigate();
  const [image, setImage] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
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

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      {/* Profile Content */}
      <motion.main 
        className="relative grid grid-cols-1 md:grid-cols-[1fr_2fr]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Sidebar - Hidden on mobile */}
        <motion.aside 
          className="hidden md:block bg-gradient-to-b from-yellow-500 to-blue-400"
          variants={itemVariants}
        >
          <Link to="/" className="text-5xl pl-4 pt-4 block">
            <GoArrowLeft className="text-white" />
          </Link>
          <motion.div 
            className="flex items-center gap-4 mt-6 py-4 pl-12 relative"
            variants={itemVariants}
          >
            <div className="w-16 h-16 rounded-full bg-cover bg-no-repeat bg-[url('Pictures/profile.jpg')]"></div>
            <label htmlFor="file-upload" className="text-white text-lg font-semibold">
              User Name
            </label>
            <input
              id="file-upload"
              type="file"
              name="profile_photo"
              placeholder="Photo"
              className="my-auto hidden"
              required=""
              capture
            />
            <div className="absolute w-[180px] border-b border-white left-14 top-1/3"></div>
          </motion.div>
        </motion.aside>

        {/* Mobile Back Button - Visible only on mobile */}
        <div className="md:hidden flex items-center px-4 pt-4">
          <Link to="/" className="text-4xl">
            <GoArrowLeft className="text-green-800" />
          </Link>
        </div>

        {/* Profile Form */}
        <motion.div 
          className="w-full px-4 md:pl-12 pt-4 pb-8"
          variants={itemVariants}
        >
          <motion.form onSubmit={formik.handleSubmit} variants={itemVariants}>
            <div className="change-account">
              <motion.h2 
                className="text-2xl mb-6 inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-400"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                YOUR ACCOUNT SETTINGS
              </motion.h2>
              
              <motion.div 
                className="grid w-full md:w-2/5 mb-4"
                variants={itemVariants}
              >
                <label className="block text-gray-700">Name</label>
                <motion.input
                  onChange={formik.handleChange}
                  className="py-2 px-3 my-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="User Name"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              
              <motion.div 
                className="grid w-full md:w-2/5 mb-4"
                variants={itemVariants}
              >
                <label className="block text-gray-700">Email Address</label>
                <motion.input
                  onChange={formik.handleChange}
                  className="py-2 px-3 my-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 mt-6 py-4"
                variants={itemVariants}
              >
                <div className="w-16 h-16 rounded-full bg-cover bg-no-repeat bg-[url('Pictures/profile.jpg')]"></div>
                <label
                  htmlFor="file-upload"
                  className="inline-block py-1 px-3 text-[#053b47] tracking-[1.2px] cursor-pointer relative my-auto"
                >
                  Choose new Photo
                  <span className="absolute w-4/5 border-b border-[#053b47] left-[10%] top-[80%]"></span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="profile_photo"
                  placeholder="Photo"
                  className="my-auto hidden"
                  onChange={formik.handleChange}
                  required=""
                  capture
                />
              </motion.div>
              
              <motion.div 
                className="flex justify-end pr-0 md:pr-14"
                variants={itemVariants}
              >
                <motion.button
                  type="submit"
                  className="bg-[#053b47] py-2 px-6 font-normal text-lg md:text-xl text-[#faf3ee] rounded-tl-full hover:cursor-pointer"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Save Changes
                </motion.button>
              </motion.div>
            </div>
          </motion.form>

          <motion.form variants={itemVariants}>
            <div className="change-password mt-8">
              <motion.h2 
                className="text-2xl mb-6 inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-400"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                PASSWORD CHANGE
              </motion.h2>
              
              <motion.div 
                className="grid w-full md:w-2/5 mb-4"
                variants={itemVariants}
              >
                <label className="block text-gray-700">Current Password</label>
                <motion.input
                  onChange={formik.handleChange}
                  className="py-2 px-3 my-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="current password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              
              <motion.div 
                className="grid w-full md:w-2/5 mb-4"
                variants={itemVariants}
              >
                <label className="block text-gray-700">New Password</label>
                <motion.input
                  onChange={formik.handleChange}
                  className="py-2 px-3 my-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="new password"
                  type="password"
                  name="newPassword"
                  value={formik.values.newPassword}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              
              <motion.div 
                className="grid w-full md:w-2/5 mb-8"
                variants={itemVariants}
              >
                <label className="block text-gray-700">Confirm Password</label>
                <motion.input
                  onChange={formik.handleChange}
                  className="py-2 px-3 my-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div 
                className="flex justify-end pr-0 md:pr-14"
                variants={itemVariants}
              >
                <motion.button
                  type="submit"
                  className="bg-[#053b47] py-2 px-6 font-normal text-lg md:text-xl text-[#faf3ee] rounded-tl-full hover:cursor-pointer"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Save Changes
                </motion.button>
              </motion.div>
            </div>
          </motion.form>
        </motion.div>
      </motion.main>
    </div>
  );
}

export default Profile;