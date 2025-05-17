// 📁 src/pages/RechercheResultats.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "../Navbar";
import Footer from "../components/Footer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RechercheResultats({ isAuthenticated, setIsAuthenticated, userPhoto }) {
  const query = useQuery();
  const ville = query.get("ville");
  const nom = query.get("nom");
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultats = async () => {
      try {
        let res;
        if (nom) {
          res = await api.get(`/accounts/etablissements/?search=${nom}`);
        } else if (ville) {
          res = await api.get(`/accounts/etablissements-par-ville/${ville}/`);
        }
        setResultats(res?.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultats();
  }, [ville, nom]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userPhoto={userPhoto}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">
          Résultats de recherche
        </h1>

        {loading ? (
          <p>Chargement en cours...</p>
        ) : resultats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resultats.map((etab) => (
              <div key={etab.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {etab.image && (
                  <img src={etab.image} alt={etab.nom} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{etab.nom}</h2>
                  <p className="text-sm text-gray-600">📍 {etab.adresse}</p>
                  <p className="text-sm text-gray-500 mt-2">{etab.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun établissement trouvé pour cette recherche.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
