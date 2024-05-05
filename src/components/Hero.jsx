import { rectangleImage } from "../main";
import "./Hero.css";
import { learningImg } from "../main";
import { motion as m } from "framer-motion";
function Hero() {
  return (
    <section className="hero px-20  ">
      <m.img
        initial={{ x: -500 }}
        animate={{ x: [900, 0] }}
        transition={{
          duration: "1.5",
          delay: "0.2",
        }}
        className="hero-bg pt-5"
        src={rectangleImage}
        alt="hero-img"
      />
      <main className="grid grid-cols-2 w-full">
        <div className=" flex flex-col gap-2 justify-center hero-description">
          <h2 className="text-5xl">Grow your Children</h2>
          <h1 className="text-6xl ">With Us</h1>
          <p>
            where every child's journey begins with joy,curosity,and endless
            possibilities! We are thrilled to embark on this educational
            adventure with you and your little ones
          </p>
          <div className="mt-9">
            <span
              className="bg-teal-700 text-slate-50  px-6 py-4 rounded-tr-full hover:cursor-pointer text-xl "
              itemType="button"
            >
              Enrol Now
            </span>
          </div>
        </div>
        <img className="w-10/12" src={learningImg} alt="learning" />
      </main>
    </section>
  );
}

export default Hero;
