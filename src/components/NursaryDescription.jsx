import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiUsers, FiPhone, FiCalendar, FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";

// Sample images for gallery and header
const headerImages = [
  "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1588075592449-8a37749a914e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80"
];

const galleryImages = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
];

// Premium Animated Star Rating Component
const StarRating = ({ rating }) => {
  const stars = Array(5).fill(0);
  
  return (
    <div className="flex items-center">
      {stars.map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: 1,
            opacity: 1,
            transition: { 
              delay: index * 0.15,
              type: "spring",
              stiffness: 500
            }
          }}
          whileHover={{ 
            scale: 1.3,
            rotate: [0, 15, -15, 0],
            transition: { duration: 0.4 }
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={index < rating ? "currentColor" : "none"}
            className={`mr-1 ${index < rating ? "text-amber-400" : "text-gray-300"}`}
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// Premium Detail Card with Advanced Animations
const DetailCard = ({ title, value, icon, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: delay * 0.1, duration: 0.6 }
      }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(14, 124, 134, 0.15)",
        transition: { type: "spring", stiffness: 400 }
      }}
      className="bg-white p-5 rounded-xl border border-gray-100 mb-4 group relative overflow-hidden"
    >
      {/* Animated background effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-teal-50 to-white opacity-0 group-hover:opacity-100"
        initial={{ x: -100 }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.5 }}
      />
      
      <div className="flex items-center gap-4 relative z-10">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="bg-teal-100 p-3 rounded-lg text-teal-600 flex-shrink-0"
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
          <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Carousel Component with Enhanced Animations
const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === headerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-96 w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={headerImages[currentIndex]} 
            alt="Nursery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
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
  const discountedPrice = price - discount;
  const descriptionParagraphs = description.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Carousel with Auto-Sliding */}
      <HeroCarousel />

      {/* Floating Header */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                {name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-600 max-w-3xl"
              >
                {summary}
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-teal-50 rounded-xl p-4 min-w-[200px] border border-teal-100"
            >
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={rate} />
                <span className="text-teal-700 font-medium">{rate}</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>{reviews} reviews</p>
                <p>{numberOfChildren} children enrolled</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section with Staggered Text Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center"
              >
                About Our Nursery
              </motion.h2>
              
              <div className="space-y-5">
                {descriptionParagraphs.map((paragraph, index) => (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + (index * 0.15) }}
                    className="text-gray-600 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Gallery Section with Interactive Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Our Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + (index * 0.1) }}
                    whileHover={{ 
                      scale: 1.05,
                      zIndex: 1,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    className="aspect-square rounded-xl overflow-hidden relative group"
                  >
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.2 }}
                        className="text-white text-2xl"
                      >
                        👀
                      </motion.span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Key Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100"
              >
                Key Information
              </motion.h2>
              
              <div className="space-y-4">
                <DetailCard 
                  title="Location" 
                  value={nurseryLocation} 
                  icon={<FiMapPin className="w-5 h-5" />}
                  delay={1}
                />
                
                <DetailCard 
                  title="Group Size" 
                  value={groupSize} 
                  icon={<FiUsers className="w-5 h-5" />}
                  delay={2}
                />
                
                <DetailCard 
                  title="Contact" 
                  value={contact} 
                  icon={<FiPhone className="w-5 h-5" />}
                  delay={3}
                />
              </div>
            </motion.div>

            {/* Pricing Card with Floating Discount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative overflow-hidden"
            >
              {discount > 0 && (
                <motion.div
                  initial={{ rotate: -45, y: -40, x: -40 }}
                  animate={{ rotate: -45, y: -30, x: -30 }}
                  whileHover={{ rotate: -35 }}
                  className="absolute -top-8 -left-8 bg-amber-400 text-amber-900 font-bold px-12 py-2 text-sm"
                >
                  SAVE {discountPercentage}%
                </motion.div>
              )}
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Pricing</h2>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Fee</span>
                  <div className="text-right">
                    {discount > 0 && (
                      <span className="text-sm text-gray-400 line-through mr-2">{price} EG</span>
                    )}
                    <span className="font-semibold text-gray-900 text-xl">{discountedPrice} EG</span>
                  </div>
                </div>
                
                {discount > 0 && (
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-teal-50 rounded-lg p-4 flex items-center justify-between border border-teal-100"
                  >
                    <span className="text-teal-700 font-medium">You save</span>
                    <span className="text-teal-700 font-bold">{discount} EG</span>
                  </motion.div>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <Link
                    to="/enroll"
                    className="block w-full text-center bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Enroll Now <FiArrowRight />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Schedule a Visit Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Schedule a Visit</h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 }}
                className="text-gray-600 mb-6"
              >
                Come see our facilities and meet our staff. We'd love to show you around!
              </motion.p>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/schedule-visit"
                  className="block w-full text-center bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50 py-4 px-6 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiCalendar className="w-5 h-5" /> Book a Tour
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseryDescription;