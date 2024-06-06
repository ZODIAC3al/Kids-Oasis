import NavBar from "./NavBar";
import "./AboutUs.css";
import { about } from "../main"; // Make sure to update the path to your image

function AboutUs() {
  return (
    <section className="about-us-container">
      <NavBar />
      <section className="content-section">
        <main className="main-content">
          <div className="about-content-container">
            <div className="about-company">
              <h2>About Company</h2>
              <p>Welcome to our state-of-the-art company.</p>
            </div>
            <div className="about-image-container">
              <img
                src={about}
                className="image block "
                alt="about our company"
              />
            </div>
          </div>
        </main>
        <footer className="footer">
          <div className="about-content">
            <div className="footer-header">
              <h4 className="footer-title">Company Unique Partners</h4>
              <p className="footer-subtitle">
                We are thrilled to partner with them!
              </p>
            </div>
            <div className="partner-images">
              <div className="partner-image"></div>
              <div className="partner-image"></div>
              <div className="partner-image"></div>
              <div className="partner-image"></div>
            </div>
          </div>
        </footer>
      </section>
    </section>
  );
}

export default AboutUs;
