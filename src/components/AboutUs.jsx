import NavBar from "./NavBar";
import "./AboutUs.css";
import { about } from "../main";
function AboutUs() {
  return (
    <section className="w-full  md:h-full flex flex-col justify-items-stretch">
      <NavBar className="w-full" />
      <main className="about">
        <div className="main-content ">
          <h2 className="md:text-lg">About Company</h2>
          <p className="md:text-sm">Welcome to state</p>
        </div>
        <div className="flex justify-center">
          <img
            src={about}
            className="image md:w-100% md:h-full   "
            alt="about users"
          />
        </div>
      </main>
      <footer>
        <div className="about-content flex flex-col justify-center pt-4 ">
          <div className="footer-header grid justify-center mb-4  ">
            <h4 className="">Company Unique Partners</h4>
            <p>We are thrilled to Partner With them !</p>
          </div>
          <div className="flex justify-center gap-14 mb-14">
            <div className="partener-image"></div>
            <div className="partener-image"></div>
            <div className="partener-image"></div>
            <div className="partener-image"></div>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default AboutUs;
