import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { GoArrowLeft, GoChevronDown } from "react-icons/go";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";

export const token = (token) => {
  return token;
};
function Login() {
  let error = "";
  const [errMessage, setErrMessage] = useState({ message: "" });
  const router = useNavigate();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: (values) => {
      axios
        .post(`https://kids-oasis-smti.onrender.com/api/v1/users/login`, values)
        .then((res) => {
          console.log(res.data);
          const token = res.data.token;

          document.cookie = `authToken=${token}; path=/`;
          localStorage.setItem("authToken", token);
          router("/", { state: { values } });
        })
        .catch((err) => setErrMessage({ message: err.response.data.message }));
    },
  });
  if (errMessage.message) {
    error = (
      <div className=" flex flex-col justify-center bg-red-200 tracking-wide align-middle">
        <p className="text-sm text-center py-3 text-red-500 ">
          {errMessage.message}
        </p>
      </div>
    );
  }
  return (
    <div className="login-container ">
      <div className="image-container"></div>
      <div className="form container pl-8">
        <form
          onSubmit={formik.handleSubmit}
          className=" flex flex-col gap-6 lg:pl-12 md:pl-16 sm:pl-0"
        >
          <div className="form-header">
            <Link to="/" className="btn-back">
              <GoArrowLeft />
            </Link>
            <p className="">Welcome Back!</p>
          </div>
          <div>{error}</div>
          <div className="grid w-full input">
            <label className="block">Email</label>
            <input
              className="w-3/5"
              placeholder="Enter your email"
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
            />
          </div>

          <div className="grid pb-16 input">
            <label className="block">Password</label>
            <div className="flex location w-3/5">
              <input
                className="w-full"
                placeholder="Enter your password"
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                required
              />
              <span>
                <GoChevronDown className="text-xl mr-2 mt-1 password-icon" />
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center p-auto">
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
                <Link to="/signup" className="signup-link">
                  Sign Up
                </Link>
              </p>
              <p className="forget-container text-center">
                <Link to="/forget" className="signup-link">
                  Forgot Password?
                </Link>
              </p>
            </div>
          </div>
          <div className="button-container ">
            <button
              type="submit"
              className=" btn-forward rounded-tl-full hover:cursor-pointer text-base"
              itemType="button"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
