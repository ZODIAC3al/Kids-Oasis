import axios from "axios";
import { useFormik } from "formik";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";
// import { token } from "./Login";

function ResetPassword() {
  const router = useNavigate();
  const { id, token } = useParams();
  const formik = useFormik({
    initialValues: { password: "", passwordConfirm: "" },
    onSubmit: (values) => {
      axios
        .patch(
          `https://kids-oasis-smti.onrender.com/api/v1/users/resetPassword/${id}/${token}`,
          values
        )
        .then((res) => {
          console.log(res);
          const token = res.data.token;
          document.cookie = `authToken=${token}; path=/`;
          localStorage.setItem("authToken", token);
          router("/login", { state: { values } });
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
              placeholder="password"
              type="password"
              name="password"
              value={formik.values.password}
              required
            />
          </div>
          <div className="grid w-full">
            <label className="block">password Confirm</label>
            <input
              onChange={formik.handleChange}
              className="input-container"
              placeholder="password reset"
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
