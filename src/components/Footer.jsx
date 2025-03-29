import { motion } from "framer-motion";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

function Footer() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -3,
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const socialLinks = [
    { name: "Twitter", icon: <FaTwitter className="w-5 h-5" />, color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: <FaLinkedin className="w-5 h-5" />, color: "hover:text-blue-500" },
    { name: "Facebook", icon: <FaFacebook className="w-5 h-5" />, color: "hover:text-blue-600" },
    { name: "Instagram", icon: <FaInstagram className="w-5 h-5" />, color: "hover:text-pink-500" }
  ];

  const companyLinks = ["About Us", "Our Team", "Careers", "Press", "Blog"];
  const serviceLinks = ["Web Development", "UX Design", "Digital Strategy", "Consulting", "Support"];
  const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"];

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 text-white pt-20 pb-12 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 100 - 50 }}
            animate={{
              y: [0, 1000],
              x: [Math.random() * 100 - 50, Math.random() * 200 - 100],
              opacity: [0.8, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
          {/* Company Info */}
          <motion.div 
            variants={itemVariants}
            className="space-y-6"
          >
            <motion.div whileHover="hover" variants={hoverVariants}>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Kids Oasis
              </h3>
            </motion.div>
            <p className="text-teal-100 leading-relaxed">
              Pioneering digital solutions that drive growth and transformation for forward-thinking businesses.
            </p>
            
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    scale: 1.2,
                    color: social.color.replace('hover:', '')
                  }}
                  className={`text-teal-200 transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h4 
              whileHover="hover" 
              variants={hoverVariants}
              className="text-lg font-semibold text-cyan-200"
            >
              Company
            </motion.h4>
            <ul className="space-y-3">
              {companyLinks.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    x: 5,
                    color: "#7dd3fc"
                  }}
                >
                  <a
                    href="#"
                    className="text-teal-100 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-cyan-300 rounded-full mr-3"></span>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h4 
              whileHover="hover" 
              variants={hoverVariants}
              className="text-lg font-semibold text-cyan-200"
            >
              Services
            </motion.h4>
            <ul className="space-y-3">
              {serviceLinks.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    x: 5,
                    color: "#7dd3fc"
                  }}
                >
                  <a
                    href="#"
                    className="text-teal-100 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-cyan-300 rounded-full mr-3"></span>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h4 
              whileHover="hover" 
              variants={hoverVariants}
              className="text-lg font-semibold text-cyan-200"
            >
              Contact
            </motion.h4>
            <address className="not-italic text-teal-100 space-y-4">
              <motion.p 
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className="flex items-start"
              >
                <FaMapMarkerAlt className="flex-shrink-0 mt-1 mr-3 text-cyan-300" />
                123 Innovation Way<br />
                San Francisco, CA 94107
              </motion.p>
              <motion.p 
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className="flex items-center"
              >
                <FaPhone className="flex-shrink-0 mr-3 text-cyan-300" />
                (555) 123-4567
              </motion.p>
              <motion.p 
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className="flex items-center"
              >
                <FaEnvelope className="flex-shrink-0 mr-3 text-cyan-300" />
                hello@KidsOasis.com
              </motion.p>
            </address>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1, type: "spring" }}
          className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent my-10"
        />

        {/* Bottom */}
        <motion.div 
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <motion.p 
            variants={itemVariants}
            className="text-center md:text-left text-teal-200 mb-6 md:mb-0"
          >
            © {new Date().getFullYear()} KidsOasis. All rights reserved.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 md:gap-6"
          >
            {legalLinks.map((item, index) => (
              <motion.a
                key={index}
                href="#"
                variants={itemVariants}
                whileHover={{
                  color: "#a5f3fc",
                  scale: 1.05,
                  textDecoration: "underline"
                }}
                className="text-teal-200 hover:text-white text-sm"
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white shadow-xl rounded-full p-4 flex items-center justify-center"
          aria-label="Contact us"
        >
          <FaEnvelope className="w-6 h-6" />
        </motion.a>
      </motion.div>
    </motion.footer>
  );
}

export default Footer;