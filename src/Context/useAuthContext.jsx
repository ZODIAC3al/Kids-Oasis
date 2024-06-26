import { AuthContext } from "./AuthContext";
import { useContext } from "react";
function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error(`useAuthContext must be used inside an AuthContextProvider`);
  }
  return context;
}

export default useAuthContext;
