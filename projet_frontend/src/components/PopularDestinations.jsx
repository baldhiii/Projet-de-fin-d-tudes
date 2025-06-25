// dans components/PopularDestinations.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/auth/destinations/")
      .then((res) => setDestinations(res.data))
      .catch((err) => console.error("Erreur chargement destinations :", err));
  }, []);

  return (
    <section className="px-6 py-12 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-white drop-shadow-md">
            ✨ Destinations disponibles
          </h2>
          <a href="#" className="text-cyan-400 font-medium hover:underline">Voir tout →</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group bg-black/80"
            >
              <img
                src={dest.image}
                alt={dest.ville}
                className="w-full h-60 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />

              {/* Overlay pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Contenu texte */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white z-10">
                <h3 className="text-xl font-bold drop-shadow-lg">{dest.ville}</h3>
                <p className="text-sm text-gray-200 drop-shadow mb-2">
                  {dest.nombre_hotels} hôtels · {dest.nombre_restaurants} restaurants
                </p>
              </div>

              {/* Bouton centré visible uniquement au survol */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <button
                  onClick={() => navigate(`/explore/${dest.ville}`)}
                  className="px-6 py-2 rounded-full bg-white text-gray-900 font-semibold text-sm shadow-md"
                >
                  Explorer
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
