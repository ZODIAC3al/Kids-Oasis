import NavBar from "./NavBar";
import { trigger } from "../main";
import Card from "./Card";

function Academies() {
  // const [data, setData] = useState({});
  // useEffect(() => {
  //   axios
  //     .get(`https://kids-oasis-smti.onrender.com/api/v1/users/nurseries`)
  //     .then((res) => {
  //       setData(res);
  //       console.log(res);
  //     });
  // }, []);

  return (
    <div className="academies grid-cols-4 align-middle  justify-between">
      <NavBar />

      <section className="px-16 mt-4">
        <div className="flex justify-end">
          <div className="search-container flex py-2 rounded-lg border-solid border-x-2 border-y-2 ">
            <input type="search" className=" px-8" />
            <img src={trigger} alt="trigger" className="pr-4" />
          </div>
        </div>
        <main className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mb-4">
          <Card
            location="5 El-Khateeb, العجمي البحري، قسم الدخيلة، محافظة الإسكندرية 5313681"
            name="Blossom Kids"
            summary="Where every child blossoms into their full potential."
            groupSize="30"
            numberOfChildren="25"
            rate="4.9"
            contact="01254684456"
            price="1650"
            reviews="35"
            description="Blossom Kids Academy is dedicated to providing a nurturing and stimulating environment for children to discover and flourish."
            discount="150"
          />
          <Card
            location="خالد إبن الوليد، البيطاش شرق، قسم الدخيلة، محافظة الإسكندرية"
            name="Growing Minds"
            summary="Where young minds flourish and thrive."
            groupSize="20"
            numberOfChildren="15"
            rate="4.9"
            contact="01235189965"
            price={1400}
            reviews="35"
            description="Growing Minds Academy is dedicated to providing a nurturing and stimulating environment for children to learn, explore, and develop their full potential."
            discount={200}
          />
          <Card
            location="2 عبد العزيز مطاريد، البيطاش شرق، قسم الدخيلة، الإسكندرية"
            name="El-basmala"
            summary="Where young minds flourish and thrive."
            groupSize="30"
            numberOfChildren="25"
            rate="4.9"
            contact="01254684456"
            price="1400"
            reviews="35"
            description="El-basmala Academy is dedicated to providing a nurturing and stimulating environment for children to discover and flourish."
            discount="150"
          />
        </main>
      </section>
    </div>
  );
}

export default Academies;
