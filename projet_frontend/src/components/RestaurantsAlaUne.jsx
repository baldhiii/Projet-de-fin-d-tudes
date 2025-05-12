// 📁 src/components/RestaurantsAlaUne.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RestaurantsAlaUne() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/accounts/restaurants-aleatoires/");
        setRestaurants(res.data);
      } catch (err) {
        console.error("Erreur chargement restaurants à la une :", err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="w-full px-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          🍽️ Restaurants à la une
        </h2>
        <button
          onClick={() => navigate("/explore/restaurants")}
          className="text-cyan-500 hover:underline text-sm"
        >
          Voir tout →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((resto) => (
          <div
            key={resto.id}
            onClick={() => navigate(`/etablissement/${resto.id}`)}
            className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 group"
          >
            <img
              src={resto.image}
              alt={resto.nom}
              className="w-full h-56 object-cover group-hover:brightness-90"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white px-4 py-3">
              <h3 className="text-lg font-semibold">{resto.nom}</h3>
              <p className="text-sm">{resto.destination?.ville || "Ville inconnue"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
