// import { NavLink } from "react-router-dom";
import { useLocation } from "react-router";
import Hero from "./Hero";
import NavBar from "./NavBar";
// import { useCallback } from "react";
// import Api from "./Api";
// import Login from "./Login";
// import SignUp from "./SignUp";

function Home() {
  // const { email } = location.state || {};

  return (
    <div className="home-container h-screen">
      <NavBar />
      <Hero />
    </div>
  );
}

export default Home;
