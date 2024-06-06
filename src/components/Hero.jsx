import { rectangleImage, learningImg } from "../main";
import { vector2 } from "../main";
import { motion as m } from "framer-motion";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero px-4 md:px-20">
        <m.img
          initial={{ x: -500 }}
          animate={{ x: [900, 0] }}
          transition={{
            duration: 1.5,
            delay: 0.2,
          }}
          className="hero-bg justify-self-end pt-5 lg:pr-0 md:pr-12 "
          src={rectangleImage}
          alt="hero-img"
        />
        <m.img
          initial={{ x: -500 }}
          animate={{ x: [900, 0] }}
          transition={{
            duration: 1.5,
            delay: 0.2,
          }}
          className="hero-mobile-bg justify-self-end pt-5 lg:pr-0 md:pr-12 "
          src={vector2}
          alt="hero-img"
        />
        <main className="grid grid-cols-1 md:grid-cols-2 w-full">
          <div className="hero-data flex flex-col gap-2 lg:justify-center md:justify-center md:mt-16 hero-description">
            <h2 className="text-2xl lg:text-5xl md:text-lg sm:text-sm">
              Grow your Children
            </h2>
            <h1 className="text-3xl lg:text-6xl md:text-xl sm:text-base">
              With Us
            </h1>
            <p className=" lg:text-sm md:text-xs sm:text-xs  hero-description">
              Where every child's journey begins with joy, curiosity,
              <br />
              and endless possibilities! We are thrilled to embark
              <br />
              on this educational adventure with you and your little ones.
            </p>
            <div className="lg:mt-9 md:mt-9 sm:mt-4">
              <button
                className="hero-btn bg-teal-700 text-slate-50 lg:px-6 lg:py-4 md:px-6 md:py-4 sm:px-5 sm:py-4 rounded-tr-full hover:cursor-pointer lg:text-xl md:text-sm md:py-2 md:px-4"
                type="button"
              >
                Enroll Now
              </button>
            </div>
          </div>
          <img
            className="w-full lg:w-10/12 md:w-full  "
            src={learningImg}
            alt="learning"
          />
        </main>
      </div>
      <main className="hero-partner lg:mt-16 md:mt-20 sm:mt-8 h-80">
        <div className="lg:grid lg:grid-cols-2 sm:flex sm:flex-col   md:grid md:grid-cols-2 h-36 mb-14">
          <aside className="partner-one lg:flex lg:flex-col md:flex md:flex-col  lg:gap-2 lg:justify-center lg:pb-8  md:gap-2 md:justify-center md:pb-8 ">
            <h3 className="text-center ">Partner Name</h3>
            <p className="text-center">A short overview of the partner</p>
          </aside>
          <aside className="flex justify-center ">
            <div className="img"></div>
          </aside>
          <aside className="lg:hidden  md:hidden  sm:gap-4 sm:justify-center sm:pb-8 ">
            <h3 className="text-center ">Partner Name</h3>
            <p className="text-center">A short overview of the partner</p>
          </aside>
        </div>
        <div className=" lg:grid lg:grid-cols-2 sm:flex sm:flex-col md:grid md:grid-cols-2 h-36 mb-14">
          <aside className="flex justify-center">
            <div className="img"></div>
          </aside>
          <aside className="flex flex-col gap-4 justify-center pb-8 ">
            <h3 className="text-center">Partner Name</h3>
            <p className="text-center">A short overview of the partner</p>
          </aside>
        </div>
      </main>
    </section>
  );
}

export default Hero;
