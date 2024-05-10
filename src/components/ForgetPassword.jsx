import axios from "axios";
import { useFormik } from "formik";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router";

function ForgetPassword() {
  const router = useNavigate();
  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: (values) => {
      axios
        .post(
          `https://kids-oasis-smti.onrender.com/api/v1/users/forgotPassword`,
          values
        )
        .then((res) => {
          console.log(res);
          router("/reset", { state: { values } });
        })
        .catch((err) => console.log(err));
    },
  });
  return (
    <div className="login-container">
      <div className="image-container"></div>

      <div className="form">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 ">
          <div className="form-header pb-4">
            <button className="btn-back">
              <GoArrowLeft />
            </button>
            <p className="font-bold ">Forget Password</p>
          </div>
          <div className="flex flex-col gap-y-8 pb-8 w-full">
            <p className="forget-container text-md text-teal-800">
              Enter the email address you used when you joined and we’ll send
              you instructions to reset your password.
            </p>
            <p className="forget-container text-md text-teal-800">
              For security reasons, we do{" "}
              <span className="font-extrabold">NOT</span> store your password.
              So rest assured that we will never send your password via email.
            </p>
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

          <div className="button-container ">
            <button
              type="submit"
              className="btn-forward rounded-tl-full hover:cursor-pointer text-base "
              itemType="button"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
