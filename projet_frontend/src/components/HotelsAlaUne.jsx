// 📁 src/components/HotelsAlaUne.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function HotelsAlaUne() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get("/accounts/hotels-aleatoires/");
        setHotels(res.data);
      } catch (err) {
        console.error("Erreur chargement hôtels à la une :", err);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="w-full px-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          🏨 Hôtels à la une
        </h2>
        <button
          onClick={() => navigate("/explore/hotels")}
          className="text-cyan-500 hover:underline text-sm"
        >
          Voir tout →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => navigate(`/etablissement/${hotel.id}`)}
            className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 group"
          >
            <img
              src={hotel.image}
              alt={hotel.nom}
              className="w-full h-56 object-cover group-hover:brightness-90"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white px-4 py-3">
              <h3 className="text-lg font-semibold">{hotel.nom}</h3>
              <p className="text-sm">
                {hotel.destination?.ville || "Ville inconnue"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
