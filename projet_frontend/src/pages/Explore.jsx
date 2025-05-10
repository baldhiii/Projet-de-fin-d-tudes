import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const themes = {
  light: { bg: "bg-white", text: "text-gray-900" },
  dark: { bg: "bg-gray-900", text: "text-white" },
  cyan: { bg: "bg-cyan-100", text: "text-gray-900" },
  rose: { bg: "bg-rose-100", text: "text-gray-900" },
  black: { bg: "bg-black", text: "text-white" },
};

export default function Explore() {
  const { ville } = useParams();
  const [etablissements, setEtablissements] = useState([]);
  const [theme, setTheme] = useState("black");
  const [type, setType] = useState("hotel"); // 'hotel' ou 'restaurant'
  const current = themes[theme];
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/auth/destinations/${ville}/etablissements/`)
      .then((res) => {
        setEtablissements(res.data);
      })
      .catch((err) => {
        console.error("Erreur chargement établissements:", err);
        alert("Erreur : impossible de charger les établissements");
      });
  }, [ville]);

  const etablissementsFiltres = etablissements.filter((etab) => etab.type === type);

  return (
    <div className={`min-h-screen ${current.bg} ${current.text} px-6 py-12 mt-24 transition-all duration-500`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold drop-shadow-md">
            Résultats pour : <span className="text-cyan-500">{ville}</span>
          </h2>
        </div>

        {/* Boutons de filtre Hôtel / Restaurant */}
        <div className="flex space-x-4 mb-10">
          <button
            onClick={() => setType("hotel")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              type === "hotel" ? "bg-cyan-500 text-white" : "bg-white text-gray-800"
            }`}
          >
            Hôtels
          </button>
          <button
            onClick={() => setType("restaurant")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              type === "restaurant" ? "bg-cyan-500 text-white" : "bg-white text-gray-800"
            }`}
          >
            Restaurants
          </button>
        </div>

        {/* Grille des établissements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {etablissementsFiltres.map((etab, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="rounded-xl overflow-hidden shadow-lg bg-white text-gray-800 dark:bg-gray-800 dark:text-white transition"
            >
              <img
                src={etab.image || "/default.jpg"}
                alt={etab.nom}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{etab.nom}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  📍 {etab.destination?.ville} — ☎ {etab.telephone || "N/A"}
                </p>
                <p className="text-sm line-clamp-3">{etab.description}</p>

                <button
                  onClick={() => navigate(`/etablissement/${etab.id}`)}
                  className="mt-3 w-full text-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                >
                  {etab.type === "restaurant"
                    ? "Voir les détails / Réserver une table"
                    : "Voir les détails / Réserver une chambre"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✅ Switch Thème */}
      <div className="fixed bottom-6 left-6 flex space-x-3 z-50">
        {Object.keys(themes).map((key) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`w-5 h-5 rounded-full border shadow-md cursor-pointer transition ${
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

