import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CarouselComponent = ({ imgs = [], autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex === imgs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imgs.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay || imgs.length <= 1) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, interval);

    return () => clearTimeout(timer);
  }, [currentIndex, autoPlay, interval, imgs.length]);

  if (!imgs.length) return null;

  return (
    <div className="relative w-full h-full group">
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction === "right" ? "100%" : "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "right" ? "-100%" : "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={imgs[currentIndex]}
              alt={`Slide ${currentIndex}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {imgs.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 text-teal-800 border-none cursor-pointer p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 text-teal-800 border-none cursor-pointer p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {imgs.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {imgs.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-teal-600 w-6"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselComponent;