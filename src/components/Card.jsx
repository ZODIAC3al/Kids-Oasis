import { motion } from "framer-motion";
import { GoArrowRight } from "react-icons/go";
import StarRating from "./StarRating";
import CarouselComponent from "./CarouselComponent";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
const imgs = [
  "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", // Kids classroom
  "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", // Children playing
  "https://images.unsplash.com/photo-1588075592449-8a37749a914e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", // Preschool activity
  "https://images.unsplash.com/photo-1593078166038-e5a6ef8f589a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", // Kids learning
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"  // Outdoor play area
];
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    scale: 1.03,
    transition: {
      duration: 0.3,
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
      className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Carousel with fixed aspect ratio */}
      <div className="relative h-48 w-full overflow-hidden">
        <CarouselComponent imgs={imgs} />
      </div>

      {/* Card Content - flex-grow makes all cards same height */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-teal-800 truncate max-w-[70%]">{name}</h3>
        <div className="flex items-center">

            <span className="ml-1 text-sm text-teal-700">{rate}</span>
          </div>
        </div>

        <p className="text-teal-700 text-sm mb-3 line-clamp-2 flex-grow">{summary}</p>
        
        <div className="flex items-center text-xs text-teal-600 mb-4">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{location?.split(",")[0]}</span>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-teal-800 font-bold text-lg">${price - discount}</span>
            {discount > 0 && (
              <span className="ml-2 text-sm text-gray-500 line-through">${price}</span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="p-2 rounded-full bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors"
            aria-label="View details"
          >
            <GoArrowRight className="text-xl" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

Card.propTypes = {
  location: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  groupSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  numberOfChildren: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  contact: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reviews: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default Card;