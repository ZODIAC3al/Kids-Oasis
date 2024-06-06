import { useState } from "react";
import useAuthContext from "../Context/useAuthContext";

const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (
    firstName,
    lastName,
    email,
    role,
    address,
    gender,
    password,
    passwordConfirm,
    phoneNumber
  ) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(
      "https://kids-oasis-smti.onrender.com/api/v1/users/signup",
      {
        mathod: "POST",
        headers: { "context-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role,
          address,
          gender,
          password,
          passwordConfirm,
          phoneNumber,
        }),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
    }
    if (response.ok) {
      //save user to local STORAGE

      localStorage.setItem("user", JSON.stringify(json));

      //update auth context
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
    }
  };
  return { signup, isLoading };
};

export default useSignup;
