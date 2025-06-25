import { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../Navbar";
import SearchBar from "../components/SearchBar";
import SplineViewer from "../components/SplineViewer";
import AdvancedSearch from "../components/AdvancedSearch";
import PopularDestinations from "../components/PopularDestinations";
import HotelsAlaUne from "../components/HotelsAlaUne";
import RestaurantsAlaUne from "../components/RestaurantsAlaUne";
import EtablissementsRecents from "../components/EtablissementsRecents";
import PourquoiChoisirLuxvia from "../components/PourquoiChoisirLuxvia";
import TemoignagesClients from "../components/TemoignagesClients";
import LuxviaMobileApp from "../components/LuxviaMobileApp";
import Footer from "../components/Footer";

const images = [
  "/images/hotel1.jpg",
  "/images/restaurant1.jpg",
  "/images/spa.jpg",
];

const settings = {
  dots: false,
  arrows: false,
  infinite: true,
  autoplay: true,
  speed: 5000,
  autoplaySpeed: 7000,
  fade: true,
  pauseOnHover: false,
};

function Home({ isAuthenticated, setIsAuthenticated, userPhoto }) {
  const themeOptions = ["light", "dark", "cyan", "rose", "black"];
  const [theme, setTheme] = useState(() => {
    const randomIndex = Math.floor(Math.random() * themeOptions.length);
    return themeOptions[randomIndex];
  });
  const [search, setSearch] = useState("");

  const themes = {
    light: { bg: "bg-white", text: "text-gray-900" },
    dark: { bg: "bg-gray-900", text: "text-white" },
    cyan: { bg: "bg-cyan-100", text: "text-gray-900" },
    rose: { bg: "bg-rose-100", text: "text-gray-900" },
    black: { bg: "bg-black", text: "text-white" },
  };

  const current = themes[theme];

  return (
    <div
      className={`w-screen min-h-screen overflow-x-hidden ${current.bg} ${current.text} transition-all duration-500`}
    >
      
      <Navbar
        theme={theme}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userPhoto={userPhoto}
      />

      
      <main className="relative w-full h-screen overflow-hidden">
        
        <Slider {...settings} className="absolute inset-0 z-0">
          {images.map((src, index) => (
            <div key={index} className="h-screen w-full">
              <div
                className="w-full h-full bg-center bg-cover animate-zoom"
                style={{ backgroundImage: `url(${src})` }}
              />
            </div>
          ))}
        </Slider>

        
        <div className="absolute inset-0 bg-[url('/images/grillage.svg')] opacity-20 z-10 pointer-events-none" />

        
        <div className="relative z-20 flex flex-col items-center justify-start pt-32 px-4">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wide">
              Bienvenue sur <span className="text-cyan-500">Luxvia</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-200">
              Réservez vos hôtels & restaurants avec une expérience immersive.
            </p>
          </motion.div>

          
          <div className="w-full max-w-3xl mb-8">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/*  Animation 3D 
          <div className="w-full h-[250px] overflow-hidden mb-8">
            <SplineViewer />
          </div> */}

          
          <div className="w-full max-w-5xl px-4 mb-8">
            <AdvancedSearch />
          </div>
        </div>
      </main>

      
      <PopularDestinations />
      <div className="w-full px-4 mb-16">
        <HotelsAlaUne />
      </div>
      <div className="w-full px-4 mb-16">
        <RestaurantsAlaUne />
      </div>
      <div className="w-full px-4 mb-16">
        <EtablissementsRecents />
      </div>
      <LuxviaMobileApp theme={theme} />
      <TemoignagesClients />
      <div className="mt-0">
        <PourquoiChoisirLuxvia />
      </div>
      <Footer theme={theme} />

      
      <div className="fixed bottom-6 left-6 flex space-x-3 z-50">
        {Object.keys(themes).map((key) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`w-5 h-5 rounded-full border ${
              key === "light"
                ? "bg-white"
                : key === "dark"
                ? "bg-gray-900"
                : key === "cyan"
                ? "bg-cyan-400"
                : key === "rose"
                ? "bg-rose-400"
                : "bg-black"
            }`}
            title={`Thème ${key}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;


