import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Card from "./Card";

function Academies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAcademies, setFilteredAcademies] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sample academy data
  const academies = [
    {
      id: 1,
      location: "5 El-Khateeb, العجمي البحري، قسم الدخيلة، محافظة الإسكندرية 5313681",
      name: "Blossom Kids",
      summary: "Where every child blossoms into their full potential.",
      groupSize: "30",
      numberOfChildren: "25",
      rate: "4.9",
      contact: "01254684456",
      price: "1650",
      reviews: "35",
      description: "Blossom Kids Academy is dedicated to providing a nurturing and stimulating environment for children to discover and flourish.",
      discount: "150"
    },
    {
      id: 2,
      location: "خالد إبن الوليد، البيطاش شرق، قسم الدخيلة، محافظة الإسكندرية",
      name: "Growing Minds",
      summary: "Where young minds flourish and thrive.",
      groupSize: "20",
      numberOfChildren: "15",
      rate: "4.9",
      contact: "01235189965",
      price: "1400",
      reviews: "35",
      description: "Growing Minds Academy is dedicated to providing a nurturing and stimulating environment for children to learn, explore, and develop their full potential.",
      discount: "200"
    },
    {
      id: 3,
      location: "2 عبد العزيز مطاريد، البيطاش شرق، قسم الدخيلة، الإسكندرية",
      name: "El-basmala",
      summary: "Where young minds flourish and thrive.",
      groupSize: "30",
      numberOfChildren: "25",
      rate: "4.9",
      contact: "01254684456",
      price: "1400",
      reviews: "35",
      description: "El-basmala Academy is dedicated to providing a nurturing and stimulating environment for children to discover and flourish.",
      discount: "150"
    }
  ];

  useEffect(() => {
    // Initially show all academies
    setFilteredAcademies(academies);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setFilteredAcademies(academies);
      return;
    }

    const filtered = academies.filter(academy => 
      academy.name.toLowerCase().includes(term) ||
      academy.location.toLowerCase().includes(term) ||
      academy.summary.toLowerCase().includes(term) ||
      academy.description.toLowerCase().includes(term) ||
      academy.rate.includes(term) ||
      academy.price.includes(term)
    );
    
    setFilteredAcademies(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredAcademies(academies);
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

  return (
    <div className="min-h-screen bg-teal-50">
      <NavBar />

      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8"
      >
        <motion.div 
          variants={itemVariants}
          className="flex justify-end mb-8 relative"
        >
          <motion.div
            animate={isSearchFocused ? "focused" : "notFocused"}
            variants={searchVariants}
            className="flex items-center py-2 px-4 rounded-lg border-2 border-teal-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 max-w-md w-full"
          >
            <input 
              type="search" 
              placeholder="Search by name, location, rate..." 
              className="w-full px-3 py-1 outline-none text-teal-800 placeholder-teal-400"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <div className="flex items-center gap-1">
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="text-teal-500 hover:text-teal-700 transition-colors mr-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
             
            </div>
          </motion.div>
          {filteredAcademies.length === 0 && searchTerm && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 w-full max-w-md bg-white p-4 rounded-lg shadow-lg border border-teal-100"
            >
              <p className="text-teal-800">No academies found matching "{searchTerm}"</p>
            </motion.div>
          )}
        </motion.div>

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
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="text-teal-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-teal-800 mb-2">No academies found</h3>
            <p className="text-teal-600">Try adjusting your search or filter</p>
            <button 
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200 transition-colors"
            >
              Clear search
            </button>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}

export default Academies;