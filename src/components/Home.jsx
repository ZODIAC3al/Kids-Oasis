
import Hero from "./Hero";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Home() {

  return (
    <div className="home-container h-screen">
      <NavBar />
      <Hero />
      <Footer />
    </div>
  );
}

export default Home;
