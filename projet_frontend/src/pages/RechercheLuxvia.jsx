import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../components/Footer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RechercheLuxvia({ isAuthenticated, setIsAuthenticated, userPhoto }) {
  const query = useQuery();
  const ville = query.get("ville");
  const type = query.get("type");
  const date_debut = query.get("date_debut");
  const date_fin = query.get("date_fin");

  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recherche/", {
          params: {
            ville,
            type,
            date_debut,
            date_fin,
          },
        });
        setResultats(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultats();
  }, [ville, type, date_debut, date_fin]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userPhoto={userPhoto}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">
          Résultats pour {type === "restaurant" ? "Restaurants" : "Hôtels"} à {ville}
        </h1>

        {loading ? (
          <p>Chargement en cours...</p>
        ) : resultats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resultats.map((etab) => (
              <div
                key={etab.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                {etab.image && (
                  <img
                    src={etab.image}
                    alt={etab.nom}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{etab.nom}</h2>
                  <p className="text-sm text-gray-600">📍 {etab.adresse}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {etab.description?.slice(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun établissement disponible pour ces critères.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}


