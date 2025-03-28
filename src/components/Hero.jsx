import { rectangleImage, learningImg } from "../main";
import { vector2 } from "../main";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const bgVariants = {
  hidden: { x: 500, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

// New image animation coming from far right
const imageVariants = {
  hidden: { x: "100vw", opacity: 0, rotate: 10 },
  visible: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      delay: 0.4,
      duration: 1.2
    },
  },
};

function Hero() {
  return (
    <section className="relative overflow-hidden mt-16 md:mt-24 lg:mt-28">
      {/* Background images with animation */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="absolute inset-0 -z-10"
      >
        <motion.img
          variants={bgVariants}
          className="hidden md:block absolute top-0 right-0 h-[470px] lg:h-[550px] w-[85%] object-cover object-right"
          src={rectangleImage}
          alt="hero background"
        />
        <motion.img
          variants={bgVariants}
          className="md:hidden absolute top-0 right-0 h-[320px] w-[85%] object-cover object-right"
          src={vector2}
          alt="mobile hero background"
        />
      </motion.div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-10 md:py-16 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Text content */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-900"
            >
              Grow your Children
            </motion.h2>
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-medium text-teal-800"
            >
              With Us
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-base sm:text-lg md:text-lg leading-relaxed"
            >
              Where every child's journey begins with joy, curiosity, and endless
              possibilities! We are thrilled to embark on this educational
              adventure with you and your little ones.
            </motion.p>
            <motion.div variants={itemVariants} className="pt-2 sm:pt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-teal-700 hover:bg-teal-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-tr-full rounded-bl-full text-base sm:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-teal-200"
              >
                Enroll Now
              </motion.button>
            </motion.div>
          </div>

          {/* Image with enhanced animation */}
          <motion.div
            variants={imageVariants}
            className="flex justify-center md:justify-end mt-8 sm:mt-10 md:mt-0"
          >
            <motion.img
              src={learningImg}
              alt="Learning illustration"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain drop-shadow-2xl"
              whileHover={{ scale: 1.03 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Partners section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="bg-teal-50 py-12 sm:py-16 mt-12 sm:mt-16"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-teal-900 mb-8 sm:mb-12">
            Our Trusted Partners
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-4xl mx-auto">
            {[1, 2].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-teal-100 rounded-full flex items-center justify-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-teal-200 rounded-full"></div>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-semibold text-teal-800">
                    Partner Name
                  </h4>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    A short overview of the partner
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;