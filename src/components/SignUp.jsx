import "./SignUp.css";
import { GoArrowLeft, GoChevronDown } from "react-icons/go";
import { MdLocationOn } from "react-icons/md";
import { useFormik } from "formik";
// import * as yup from "yup";

import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
function SignUp() {
  // const [post,setPost] =useState();
  const router = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      address: "",
      gender: "",
      password: "",
      passwordConfirm: "",
    },
    onSubmit: async (values) => {
      console.log(values);

      try {
        // Specify the object's type as JSON
        const headers = {
          "Content-Type": "application/json",
          Header1: "raw",
        };

        const res = await axios.post(
          `https://kids-oasis-smti.onrender.com/api/v1/users/signup`,
          values,
          { headers }
        );

        console.log(res.data);
        const token = res.data.token;
        document.cookie = `authToken=${token}; path=/`;
        localStorage.setItem("authToken", token);

        router("/login", { state: values });
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
        }
      }
    },
  });

  //  validateYupSchema:yup.object({

  //  })
  return (
    <div className="login-container">
      <div className="image-container"></div>

      <div className="form">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 ">
          <div className="form-header">
            <button className="btn-back">
              <GoArrowLeft />
            </button>
            <p className="">Create an account</p>
          </div>

          <div className="name-container grid grid-cols-2">
            <div className="flex flex-col ">
              <label className="label">First Name</label>
              <input
                value={formik.values.firstName}
                onChange={formik.handleChange}
                className="w-5/6"
                type="text"
                name="firstName"
                placeholder="First Name"
              />
            </div>
            <div className="flex  flex-col ">
              <span className="label">Last Name</span>
              <input
                onChange={formik.handleChange}
                value={formik.values.lastName}
                className="w-full"
                type="text"
                name="lastName"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="grid w-full">
            <label className="block">Email</label>
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

          <div className="grid">
            <label>Location</label>
            <div className="flex location input-container">
              <input
                onChange={formik.handleChange}
                className="w-full"
                placeholder="Enter your address"
                type="text"
                name="address"
                required
                value={formik.values.address}
              />
              <span>
                <MdLocationOn className="text-xl mr-2 mt-1 location-icon" />
              </span>
            </div>
          </div>
          <div className="grid">
            <label className="block">Password</label>
            <div className="flex location input-container">
              <input
                value={formik.values.password}
                onChange={formik.handleChange}
                className="w-full"
                placeholder="Enter your password"
                type="password"
                name="password"
                required
              />
              <span>
                <GoChevronDown className="text-xl mr-2 mt-1 password-icon" />
              </span>
            </div>
          </div>
          <div className="grid">
            <label className="block">Confirm Password</label>
            <div className="flex location input-container">
              <input
                className="w-full"
                placeholder="Confirm Password"
                type="password"
                name="passwordConfirm"
                required
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
              />
              <span>
                <GoChevronDown className="text-xl mr-2 mt-1 password-icon" />
              </span>
            </div>
          </div>
          <div className="grid">
            <select
              value={formik.values.role}
              onChange={formik.handleChange}
              name="role"
              className="input-container role"
              id="role"
            >
              <option value="role">Choose a Role</option>

              <option value="parent">Parent</option>
              <option value="nurseryOwner">Nursery Owner</option>
              <option value="serviceProvider">Service Provider</option>
            </select>
          </div>

          <div className="flex gap-24 items-center">
            <label className="block mr-4">Gender</label>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <input
                  onChange={formik.handleChange}
                  className="mr-1"
                  type="radio"
                  id="id_male"
                  name="gender"
                  value="male"
                />
                <label className="mr-3" htmlFor="id_male">
                  Male
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  className="mr-1"
                  onChange={formik.handleChange}
                  type="radio"
                  id="id_female"
                  name="gender"
                  value="female"
                />

                <label htmlFor="id_female">Female</label>
              </div>
            </div>
          </div>
          <div className="showing-data flex flex-col justify-center p-auto">
            <div>
              <fieldset className="title pb-8">
                <legend className="text-xs text-neutral-500">
                  Or continue with
                </legend>
              </fieldset>
            </div>
            <div className="flex flex-col gap-y-12  w-full">
              <div className="flex justify-center gap-8 align-middle">
                <div className="social-icon"></div>
                <div className="social-icon"></div>
              </div>
              <p className="forget-container text-center">
                Dont have an account?
                <Link className="signup-link">Sign Up</Link>
              </p>
            </div>
          </div>

          <div className="button-container ">
            <button
              type="submit"
              className="btn-forward rounded-tl-full hover:cursor-pointer text-base "
              itemType="button"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
