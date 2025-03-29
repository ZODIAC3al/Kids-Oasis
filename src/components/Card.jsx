import { motion, AnimatePresence } from "framer-motion";
import { GoArrowRight, GoSearch } from "react-icons/go";
import { FiFilter } from "react-icons/fi";
import StarRating from "./StarRating";
import CarouselComponent from "./CarouselComponent";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useState } from 'react';

const imgs = [
  "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1588075592449-8a37749a914e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1593078166038-e5a6ef8f589a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.1
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

function Card({
  location,
  name,
  summary,
  groupSize,
  numberOfChildren,
  rate,
  contact,
  price,
  reviews,
  description,
  discount,
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/nursary/${name}`, {
      state: {
        location,
        name,
        summary,
        groupSize,
        numberOfChildren,
        rate,
        contact,
        price,
        reviews,
        description,
        discount,
      },
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Carousel with fixed aspect ratio */}
      <div className="relative h-48 w-full overflow-hidden">
        <CarouselComponent imgs={imgs} isHovered={isHovered} />
        {discount > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
          >
            {Math.round((discount / price) * 100)}% OFF
          </motion.div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-4">
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-teal-800 truncate max-w-[70%]">{name}</h3>
         
        </motion.div>

        <motion.p variants={itemVariants} className="text-teal-700 text-sm mb-3 line-clamp-2 flex-grow">
          {summary}
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex items-center text-xs text-teal-600 mb-4">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{location?.split(",")[0]}</span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-teal-800 font-bold text-lg">${price - discount}</span>
            {discount > 0 && (
              <span className="ml-2 text-sm text-gray-500 line-through">${price}</span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#0d9488" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
            aria-label="View details"
          >
            <GoArrowRight className="text-xl" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Enhanced Search and Filter Component
export function SearchFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    location: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <motion.form 
        onSubmit={handleSearch}
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className="relative flex-grow">
            <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search nurseries by name, location..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="ml-3 flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiFilter className="mr-2 text-teal-600" />
            <span className="text-gray-700">Filters</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-6 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]]})}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <StarRating 
                    rating={filters.rating} 
                    onRatingChange={(rating) => setFilters({...filters, rating})}
                    interactive={true}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={applyFilters}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}

Card.propTypes = {
  location: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  groupSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  numberOfChildren: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  contact: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reviews: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

SearchFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default Card;