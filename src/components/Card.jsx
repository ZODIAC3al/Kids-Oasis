import "./Card.css";
import { GoArrowRight } from "react-icons/go";
import StarRating from "./StarRating";

import { CarouselComponent } from "./CarouselComponent";
function Card() {
  return (
    <div className="card block rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
      <CarouselComponent />

      <div className="p-6">
        <h5 className="mb-2 text-xl font-medium leading-tight flex align-middle justify-between  text-teal-800">
          Nursery Name
          <StarRating maxRating={5} size={18} color="#053b47" />
        </h5>
        <p className="mb-2 text-base text-teal-800">location</p>
        <p className="mb-4 text-base text-teal-800">
          it is about 100 meters away from ypu
        </p>

        <button
          type="button"
          className="inline-block rounded-tl-full bg-gray-200 px-6 pb-1 pt-1 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 "
        >
          <GoArrowRight className="text-teal-800 text-xl" />
        </button>
      </div>
    </div>
  );
}

export default Card;
