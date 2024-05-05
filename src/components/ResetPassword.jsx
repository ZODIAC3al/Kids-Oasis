import axios from "axios";
import { useFormik } from "formik";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from 'query-string';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search); // parse query parameters
  const token = queryParams.token;  // extract token

  const formik = useFormik({
    initialValues: { password: "", passwordConfirm: "" },
    onSubmit: (values) => {
      axios
        .patch(
          `https://kids-oasis-smti.onrender.com/api/v1/users/resetPassword?token=${token}`,  // use token from query params
          values
        )
        .then((res) => {
          console.log(res);
          const newToken = res.data.token;  
          document.cookie = `authToken=${newToken}; path=/`; 
          localStorage.setItem("authToken", newToken); 
          navigate("/login");
        })
        .catch((err) => console.log(err));
    },
  });

  return (
    <div className="login-container">
      <div className="image-container"></div>
      <div className="form">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 ">
          <div className="form-header">
            <button className="btn-back">
              <GoArrowLeft />
            </button>
            <p className="">Reset Password</p>
          </div>

          <div className="grid w-full">
          <label className="block">password</label>
            <input
              onChange={formik.handleChange}
              className="input-container"
              placeholder="Enter new password"
              type="password"
              name="password"
              value={formik.values.password}
              required
            />
          </div>
          <div className="grid w-full">
            <label className="block">Confirm Password</label>
            <input
              onChange={formik.handleChange}
              className="input-container"
              placeholder="Confirm new password"
              type="password"
              name="passwordConfirm"
              value={formik.values.passwordConfirm}
              required
            />
          </div>

          <div className="button-container ">
            <button
              type="submit"
              className="btn-forward rounded-tl-full hover:cursor-pointer text-base "
              itemType="button"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
