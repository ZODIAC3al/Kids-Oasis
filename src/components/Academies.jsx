import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Card from "./Card";
import { FiSearch, FiX, FiFilter, FiFrown, FiArrowRight } from "react-icons/fi";
import {  FaMapMarkerAlt, FaStar, FaMoneyBillWave } from "react-icons/fa";

function Academies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAcademies, setFilteredAcademies] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 2000,
    location: "",
    hasDiscount: false
  });

  // Sample academy data
  const academies = [
    {
      id: 1,
      location: "5 El-Khateeb, العجمي البحري، قسم الدخيلة، محافظة الإسكندرية 5313681",
      name: "Blossom Kids",
      summary: "Where every child blossoms into their full potential.",
      groupSize: "30",
      numberOfChildren: "25",
      rate: 4.9,
      contact: "01254684456",
      price: 1650,
      reviews: "35",
      description: "Blossom Kids Academy is dedicated to providing a nurturing and stimulating environment for children to discover and flourish.",
      discount: 150
    },
    {
      id: 2,
      location: "خالد إبن الوليد، البيطاش شرق، قسم الدخيلة، محافظة الإسكندرية",
      name: "Growing Minds",
      summary: "Where young minds flourish and thrive.",
      groupSize: "20",
      numberOfChildren: "15",
      rate: 4.7,
      contact: "01235189965",
      price: 1400,
      reviews: "35",
      description: "Growing Minds Academy is dedicated to providing a nurturing and stimulating environment for children to learn, explore, and develop their full potential.",
      discount: 200
    },
    {
      id: 3,
      location: "2 عبد العزيز مطاريد، البيطاش شرق، قسم الدخيلة، الإسكندرية",
      name: "El-basmala",
      summary: "Where young minds flourish and thrive.",
      groupSize: "30",
      numberOfChildren: "25",
      rate: 4.5,
      contact: "01254684456",
      price: 1400,
      reviews: "35",
      description: "El-basmala Academy is dedicated to providing a nurturing and stimulating environment for children to discover and flourish.",
      discount: 150
    }
  ];

  useEffect(() => {
    filterAndSearchAcademies();
  }, [searchTerm, filters]);

  const filterAndSearchAcademies = () => {
    let results = academies;

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(academy => 
        academy.name.toLowerCase().includes(term) ||
        academy.location.toLowerCase().includes(term) ||
        academy.summary.toLowerCase().includes(term) ||
        academy.description.toLowerCase().includes(term)
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      results = results.filter(academy => academy.rate >= filters.minRating);
    }

    // Apply price filter
    if (filters.maxPrice < 2000) {
      results = results.filter(academy => academy.price <= filters.maxPrice);
    }

    // Apply location filter
    if (filters.location) {
      results = results.filter(academy => 
        academy.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply discount filter
    if (filters.hasDiscount) {
      results = results.filter(academy => academy.discount > 0);
    }

    setFilteredAcademies(results);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      minRating: 0,
      maxPrice: 2000,
      location: "",
      hasDiscount: false
    });
  };

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

  const searchVariants = {
    focused: {
      boxShadow: "0 0 0 2px rgba(13, 148, 136, 0.5)",
      scale: 1.02,
    },
    notFocused: {
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      scale: 1,
    }
  };

  const filterPanelVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      marginBottom: 0
    },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: "2rem",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <NavBar />

      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-end gap-4 mb-8 relative"
        >
          {/* Search Input */}
          <motion.div
            animate={isSearchFocused ? "focused" : "notFocused"}
            variants={searchVariants}
            className="flex items-center py-2 px-4 rounded-lg border-2 border-teal-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full md:max-w-md"
          >
            <FiSearch className="text-teal-400 mr-2" size={18} />
            <input 
              type="search" 
              placeholder="Search by name, location..." 
              className="w-full px-2 py-1 outline-none text-teal-800 placeholder-teal-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-teal-500 hover:text-teal-700 transition-colors"
              >
                <FiX size={18} />
              </button>
            )}
          </motion.div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters || Object.values(filters).some(Boolean)
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-teal-600 border-teal-200 hover:bg-teal-50"
            }`}
          >
            <FiFilter size={18} />
            <span>Filters</span>
            {Object.values(filters).some(Boolean) && (
              <span className="w-5 h-5 flex items-center justify-center bg-white text-teal-600 rounded-full text-xs font-bold">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={filterPanelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white p-6 rounded-xl shadow-md border border-teal-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Rating Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-teal-800 mb-3">
                    <FaStar className="text-amber-400" />
                    Minimum Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setFilters({...filters, minRating: star})}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          filters.minRating >= star 
                            ? "bg-amber-100 text-amber-500" 
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {star}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-teal-800 mb-3">
                    <FaMoneyBillWave className="text-emerald-500" />
                    Max Price: EGP {filters.maxPrice}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="2000"
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                    className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-teal-600 mt-1">
                    <span>500</span>
                    <span>2000</span>
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-teal-800 mb-3">
                    <FaMapMarkerAlt className="text-red-400" />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter area"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>

                {/* Discount Filter */}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hasDiscount}
                      onChange={(e) => setFilters({...filters, hasDiscount: e.target.checked})}
                      className="w-5 h-5 rounded border-teal-300 text-teal-600 focus:ring-teal-200"
                    />
                    <span className="text-sm font-medium text-teal-800">
                      Has Discount
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={clearAllFilters}
                  className="px-4 py-2 border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  Reset All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {filteredAcademies.length > 0 ? (
          <motion.main 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredAcademies.map(academy => (
              <motion.div 
                key={academy.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                layout
              >
                <Card
                  location={academy.location}
                  name={academy.name}
                  summary={academy.summary}
                  groupSize={academy.groupSize}
                  numberOfChildren={academy.numberOfChildren}
                  rate={academy.rate}
                  contact={academy.contact}
                  price={academy.price}
                  reviews={academy.reviews}
                  description={academy.description}
                  discount={academy.discount}
                />
              </motion.div>
            ))}
          </motion.main>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="text-teal-500 mb-6">
              <FiFrown size={64} className="opacity-70" />
            </div>
            <h3 className="text-2xl font-medium text-teal-800 mb-3">No academies found</h3>
            <p className="text-teal-600 max-w-md mb-6">
              {searchTerm || Object.values(filters).some(Boolean) 
                ? "Try adjusting your search or filter criteria"
                : "Currently there are no academies available"}
            </p>
            {(searchTerm || Object.values(filters).some(Boolean)) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Clear all filters
                <FiArrowRight />
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.section>
      
    </div>
  );
}

export default Academies;