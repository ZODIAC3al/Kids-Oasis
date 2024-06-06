import { useLocation } from "react-router";
import { CarouselComponent } from "./CarouselComponent";
import { Link } from "react-router-dom";

function NursaryDescription() {
  const location = useLocation();
  // <h1>{location.state.name}</h1>
  // <h1>{location.state.summary}</h1>
  // <h1>{location.state.location}</h1>

  // location,
  // name,
  // summary,
  // groupSize,
  // numberOfChildren,
  // rate,
  // contact,
  // price,
  // reviews,
  // description,
  // discount,
  return (
    <section className="h-screen">
      <CarouselComponent />
      <section className="w-11/12 m-auto ">
        <div className="bg-blue-200  mt-8 mb-8  px-4 lg:mt-4 md:mb-0 lg:mb-0 md:mt-8  py-2 flex justify-between align-middle rounded-lg">
          <h2 className="text-2xl text-teal-950">{location.state.name}</h2>
          <div className="flex align-middle gap-2 text-teal-950 text-sm pt-2 ">
            <span>
              {location.state.reviews} review |{" "}
              {location.state.numberOfChildren} Registered
            </span>
            <span className="flex gap-2 align-middle">
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#000000"
                strokeWidth="1.5"
              >
                <path
                  d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                  fill="#053b47"
                  stroke="#053b47"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline"
                ></path>
              </svg>
              {location.state.rate}
            </span>
          </div>
        </div>
        <main className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:mt-4 md:mt-12 gap-8">
          <aside className="shadow-xl rounded-lg">
            <div className="bg-blue-200 rounded-t-lg mb-6">
              <h4 className="px-4 py-2 text-teal-950">More Details</h4>
            </div>
            <div className="flex flex-col px-4">
              <div className="mb-4">
                <h3 className="text-xl">Max num group size</h3>
                <span className="text-sm text-teal-600">
                  {location.state.groupSize}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-xl">Number of children</h3>
                <span className="text-sm text-teal-600">
                  {location.state.numberOfChildren}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-xl">Contact</h3>
                <span className="text-sm text-teal-600">
                  {location.state.contact}
                </span>
              </div>
              <div className="flex justify-between align-middle mb-2 pt-2">
                <Link
                  to="/"
                  className="rounded-3xl px-6 py-1 bg-teal-950 text-white"
                >
                  Join Now
                </Link>
                <span className="text-sm text-teal-700">
                  {location.state.price} EG
                </span>
              </div>
            </div>
          </aside>
          <article className="lg:block md:block hidden">
            <main className="shadow-xl">
              <div className="bg-blue-200 rounded-t-lg mb-6">
                <h4 className="px-4 py-2 text-teal-950">Description</h4>
              </div>
              <span className="mb-24 px-4 inline-block text-teal-700">
                {location.state.description}
              </span>
            </main>
            <div className="flex shadow-lg rounded-lg  justify-between align-middle mt-6 px-4 py-6 bg-gradient-to-r from-amber-300 to-stone-600">
              <h3 className="text-xl  text-teal-950">
                <span className="text-3xl ">
                  {Math.floor(
                    (location.state.discount / location.state.price) * 100
                  )}{" "}
                  %{" "}
                </span>
                OFFER
              </h3>

              <Link
                to="/"
                className="rounded-3xl px-6 py-1 bg-teal-950 text-white"
              >
                Get Discount
              </Link>
            </div>
          </article>
        </main>
      </section>
    </section>
  );
}

export default NursaryDescription;
