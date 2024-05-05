import NavBar from "./NavBar";
import { trigger } from "../main";
import Card from "./Card";
function Academies() {
  return (
    <div className="academies grid-cols-4 align-middle q justify-between">
      <div>
        <NavBar />
        <section className="px-16 mt-4">
          <div className="flex justify-end">
            <div className="search-container flex py-2 rounded-lg border-solid border-x-2 border-y-2 ">
              <input type="search" className=" px-8" />
              <img src={trigger} alt="trigger" className="pr-4" />
            </div>
          </div>
          <main className="grid grid-cols-4">
            <Card />
          </main>
        </section>
      </div>
    </div>
  );
}

export default Academies;
