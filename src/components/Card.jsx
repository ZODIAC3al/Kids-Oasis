import "./Card.css";
import { GoArrowRight } from "react-icons/go";
import StarRating from "./StarRating";

import { CarouselComponent } from "./CarouselComponent";
import { useNavigate } from "react-router-dom";
// import NursaryDescription from "./NursaryDescription";
const imgs = [
  "https://images.unsplash.com/photo-1562094974-037b733a5a0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDEyfHxuZXh0fGVufDB8fHx8MTYzNjcyMzE4Mw&ixlib=rb-1.2.1&q=80&w=400",
  "https://images.unsplash.com/photo-1594376472385-e4c5513b6e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE2fHxub3ZlbHR5fGVufDB8fHx8MTYzNjcyMzE4Mw&ixlib=rb-1.2.1&q=80&w=400",
  "https://images.unsplash.com/photo-1604725336949-b3c30aa5f7c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE4fHxub3ZlbHR5fGVufDB8fHx8MTYzNjcyMzE4Mw&ixlib=rb-1.2.1&q=80&w=400",
  "https://images.unsplash.com/photo-1588018165915-7a0693065cb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fGtpZHMlMjBwbGF5aW5nJTIwaW4lMjB0aGUlMjBhcnRzJTIwYW5kJTIwY3JhZnRzJTIwY2xhc3Nyb29tfGVufDB8fHx8MTYzNjcyMzE4Mw&ixlib=rb-1.2.1&q=80&w=400",
  "https://images.unsplash.com/photo-1583318061242-ff8e90e0d72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDR8fGtpZHMlMjBwbGF5aW5nJTIwb3V0ZG9vcnxlbnwwfHx8fDE2MzY3MjMxODM&ixlib=rb-1.2.1&q=80&w=400",
];

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
    <div className="card relative block rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
      <CarouselComponent imgs={imgs} />

      <div className="p-2">
        <h5 className="mb-2 text-xl font-medium leading-tight flex  align-middle justify-between  text-teal-800">
          {name}
          <StarRating maxRating={5} size={18} color="#053b47" />
        </h5>
        <p className="mb-2 lg:text-sm md:text-sm sm:text-xs text-teal-800">
          {summary}
        </p>
        <p className="mb-8 lg:text-sm md:text-sm sm:text-xs text-teal-800">
          {location}
        </p>
        <div className="bottom-2 right-2 absolute ">
          <button
            type="button"
            onClick={() => handleClick()}
            className="inline-block rounded-tl-full bg-gray-200 px-6  text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 "
          >
            <GoArrowRight className="text-teal-800 text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
