import { motion } from "framer-motion";
import NavBar from "./NavBar";
import { about } from "../main";
import Footer from "./Footer";

// Animation configurations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
};

const hoverCard = {
  hover: {
    y: -8,
    backgroundColor: "rgba(236, 253, 245, 0.5)",
    boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300 }
  }
};

const hoverButton = {
  hover: {
    scale: 1.05,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 400 }
  },
  tap: { scale: 0.98 }
};

// Data
const partnerLogos = [
  { id: 1, name: "TechNova", gradient: "bg-gradient-to-br from-teal-400 to-teal-600" },
  { id: 2, name: "InnoWave", gradient: "bg-gradient-to-br from-blue-400 to-blue-600" },
  { id: 3, name: "GreenSphere", gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600" },
  { id: 4, name: "QuantumLeap", gradient: "bg-gradient-to-br from-cyan-400 to-cyan-600" },
  { id: 5, name: "FutureSight", gradient: "bg-gradient-to-br from-purple-400 to-purple-600" },
  { id: 6, name: "AlphaCore", gradient: "bg-gradient-to-br from-indigo-400 to-indigo-600" },
];

const stats = [
  { value: "10+", label: "Years Experience", description: "Industry leadership since 2012" },
  { value: "200+", label: "Happy Clients", description: "Global customer satisfaction" },
  { value: "50+", label: "Projects", description: "Successful implementations" },
  { value: "24/7", label: "Support", description: "Always available for you" }
];

const coreValues = [
  { title: "Innovation", description: "Pioneering new approaches to solve complex problems.", icon: "💡" },
  { title: "Integrity", description: "Building trust through transparency and accountability.", icon: "🤝" },
  { title: "Excellence", description: "Delivering work that exceeds expectations.", icon: "🏆" },
  { title: "Collaboration", description: "Creating solutions from diverse perspectives.", icon: "👥" },
  { title: "Sustainability", description: "Designing for people and planet.", icon: "🌱" },
  { title: "Empathy", description: "Understanding needs to improve lives.", icon: "❤️" }
];

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20"
      >
        {/* Hero Section */}
        <motion.section 
          variants={containerVariants}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-20 mb-24 lg:mb-32"
        >
          <div className="lg:w-1/2 space-y-6 md:space-y-8">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="inline-block"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent mb-3 leading-tight">
                Crafting Digital Excellence
              </h1>
              <motion.div 
                className="h-1.5 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-5 md:space-y-6">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed md:leading-relaxed">
                At <span className="font-semibold text-teal-600">KidsOusis</span>, we blend creativity with technology to deliver transformative digital experiences across 15 countries.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed md:leading-relaxed">
                Our team of strategists, designers, and engineers collaborate to solve complex challenges and drive measurable results.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
              <motion.button
                whileHover={hoverButton.hover}
                whileTap={hoverButton.tap}
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium shadow-md"
              >
                Meet Our Team
              </motion.button>
              <motion.button
                whileHover={{
                  ...hoverButton.hover,
                  backgroundColor: "white",
                  color: "#0d9488",
                  borderColor: "#0d9488"
                }}
                whileTap={hoverButton.tap}
                className="px-8 py-3 bg-white text-teal-600 border border-teal-600 rounded-lg font-medium shadow-sm"
              >
                Our Process
              </motion.button>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            }}
            className="lg:w-1/2 relative mt-8 lg:mt-0"
          >
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl opacity-20 blur-lg" />
            <div className="relative overflow-hidden rounded-xl shadow-xl z-10">
              <img
                src={about}
                alt="Team collaborating in modern office"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent flex items-end p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-white"
                >
                  <p className="text-sm font-medium">KidsOusis</p>
                  <p className="text-xs opacity-90">Alexandria, Egypt</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Core Values */}
        <motion.section variants={containerVariants} className="mb-24 lg:mb-32">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-800 bg-clip-text text-transparent mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Principles guiding every decision and solution
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={hoverCard.hover}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-teal-100 transition-all"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-teal-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Stats */}
        <motion.section variants={containerVariants} className="mb-24 lg:mb-32">
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={hoverCard.hover}
                className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-50 hover:border-teal-100 transition-all"
              >
                <p className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{stat.label}</h3>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Partners */}
        <motion.section
          variants={containerVariants}
          className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-800 bg-clip-text text-transparent mb-4">
              Trusted Partners
            </h2>
            <p className="text-xl text-teal-700 max-w-3xl mx-auto">
              Collaborating with visionary organizations worldwide
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8"
          >
            {partnerLogos.map((partner) => (
              <motion.div
                key={partner.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-white rounded-2xl p-5 flex items-center justify-center shadow-md hover:shadow-xl transition-all h-32"
              >
                <div className={`w-full h-full rounded-xl flex items-center justify-center text-white font-bold text-lg ${partner.gradient}`}>
                  {partner.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section
          variants={containerVariants}
          className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-3xl p-12 text-center mb-16 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, 100],
                  x: [Math.random() * 100 - 50, Math.random() * 200 - 100],
                  opacity: [0.8, 0]
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
          
          <motion.div variants={itemVariants} className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Let's discuss how we can help achieve your goals with innovative solutions.
            </p>
            <motion.div
              variants={containerVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                variants={itemVariants}
                whileHover={{ 
                  ...hoverButton.hover,
                  backgroundColor: "white",
                  color: "#0d9488"
                }}
                whileTap={hoverButton.tap}
                className="px-8 py-4 bg-white text-teal-700 rounded-lg font-semibold shadow-lg"
              >
                Get Started Today
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ 
                  ...hoverButton.hover,
                  backgroundColor: "rgba(255, 255, 255, 0.15)"
                }}
                whileTap={hoverButton.tap}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-lg font-semibold"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.main>

      <Footer />
    </div>
  );
};

export default AboutUs;