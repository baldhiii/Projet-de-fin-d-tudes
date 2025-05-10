import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";
import Navbar from "../Navbar";
import SplineViewer from "../components/SplineViewer";
import AdvancedSearch from "../components/AdvancedSearch";
import PopularDestinations from "../components/PopularDestinations";


function Home({ isAuthenticated, setIsAuthenticated, userPhoto }) {
  const [theme, setTheme] = useState("black");
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
      {/* ✅ Navbar avec état de connexion réel */}
      <Navbar
        theme={theme}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userPhoto={userPhoto}
      />

      {/* ✅ Contenu principal */}
      <main className="flex flex-col items-center justify-start pt-32 px-4">
        {/* Titre + description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wide">
            Bienvenue sur <span className="text-cyan-500">Luxvia</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 dark:text-gray-300">
            Réservez vos hôtels & restaurants avec une expérience immersive.
          </p>
        </motion.div>

        {/* ✅ Barre de recherche */}
        <div className="w-full max-w-3xl mb-8">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Animation 3D */}
        <div className="w-full h-[250px] overflow-hidden mb-10">
          <SplineViewer />
        </div>
      </main>
        {/* ✅ Barre de recherche avancée */}
<div className="w-full px-4 mb-20 flex justify-center">
  <AdvancedSearch />
</div>
{/* ✅ Section des destinations populaires */}
<PopularDestinations />
      {/* ✅ Thème Switcher */}
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

