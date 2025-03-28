import { useLocation } from "react-router";
import CarouselComponent from "./CarouselComponent";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


// Star rating component
const StarRating = ({ rating }) => {
  const stars = Array(5).fill(0);
  
  return (
    <div className="flex items-center">
      {stars.map((_, index) => (
        <svg
          key={index}
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill={index < rating ? "#053b47" : "none"}
          xmlns="http://www.w3.org/2000/svg"
          color="#053b47"
          strokeWidth="1.5"
          className="mr-1"
        >
          <path
            d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
            fill={index < rating ? "#053b47" : "none"}
            stroke="#053b47"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
};

// Detail card component
const DetailCard = ({ title, value, icon }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-lg shadow-md mb-4"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="bg-teal-100 p-2 rounded-full">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-teal-600">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const NurseryDescription = () => {
  const location = useLocation();
  const {
    name,
    summary,
    location: nurseryLocation,
    groupSize,
    numberOfChildren,
    rate,
    contact,
    price,
    reviews,
    description,
    discount,
  } = location.state;

  const discountPercentage = Math.floor((discount / price) * 100);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50"
    >
      {/* Carousel with fade animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <CarouselComponent />
      </motion.div>

      {/* Main content container */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header section */}
        <motion.div
          variants={itemVariants}
          className="bg-teal-100 rounded-xl p-4 md:p-6 mb-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div>
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-teal-900 mb-2"
              whileHover={{ scale: 1.01 }}
            >
              {name}
            </motion.h2>
            <p className="text-teal-800">{summary}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-sm text-teal-900">
                {reviews} reviews | {numberOfChildren} Registered
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <StarRating rating={rate} />
                <span className="text-teal-900 font-medium">{rate}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Details */}
          <motion.aside 
            variants={itemVariants}
            className="space-y-6"
          >
            <motion.div 
              whileHover={{ scale: 1.005 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-teal-600 p-4">
                <h4 className="text-xl font-semibold text-white">Details</h4>
              </div>
              
              <div className="p-6 space-y-6">
                <DetailCard 
                  title="Location" 
                  value={nurseryLocation} 
                  icon={
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                />
                
                <DetailCard 
                  title="Max Group Size" 
                  value={groupSize} 
                  icon={
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                />
                
                <DetailCard 
                  title="Contact" 
                  value={contact} 
                  icon={
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                />
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/"
                      className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Join Now
                    </Link>
                  </motion.div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold text-teal-700">{price} EG</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.aside>

          {/* Right column - Description and offer */}
          <motion.article 
            variants={itemVariants}
            className="space-y-6"
          >
            {/* Description card */}
            <motion.div 
              whileHover={{ scale: 1.005 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
            >
              <div className="bg-teal-600 p-4">
                <h4 className="text-xl font-semibold text-white">Description</h4>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            </motion.div>

            {/* Discount offer */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-white">
                  <span className="text-4xl">{discountPercentage}%</span> OFF
                </h3>
                <p className="text-white">Limited time offer</p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Get Discount
                </Link>
              </motion.div>
            </motion.div>
          </motion.article>
        </div>
      </div>
    </motion.section>
  );
};

export default NurseryDescription;