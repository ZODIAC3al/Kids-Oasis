import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// components/pictures/index.js
import rectangleImage from "./components/Pictures/Rectangle.png";
import logo from "./components/Pictures/logo.png";
import profile from "./components/Pictures/profile.png";
import learningImg from "./components/Pictures/Kindergarten student-amico.png";
import trigger from "./components/Pictures/Frame.png";
import about from "./components/Pictures/about.png";
import vector2 from "./components/Pictures/vector2.png";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
export { rectangleImage };
export { logo };
export { profile };
export { learningImg };
export { trigger };
export { about };
export { vector2 };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
