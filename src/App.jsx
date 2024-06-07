import "./App.css";
import AboutUs from "./components/AboutUs";
import Academies from "./components/Academies";
import ForgetPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import Profile from "./components/Profile";
// import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./components/ResetPassword";
import SignUp from "./components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NursaryDescription from "./components/NursaryDescription";
// import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/academies" element={<Academies />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/nursary/:id" element={<NursaryDescription />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
