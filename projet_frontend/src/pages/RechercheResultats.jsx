// 📁 src/pages/RechercheResultats.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RechercheResultats() {
  const query = useQuery();
  const ville = query.get("ville");
  const type = query.get("type");
  const navigate = useNavigate();

  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultats = async () => {
      try {
        const res = await api.get(`/accounts/destinations/${ville}/etablissements/`);
        const filtrés = res.data.filter((etab) => etab.type === type);
        setResultats(filtrés);
      } catch (err) {
        console.error("Erreur chargement établissements :", err);
      } finally {
        setLoading(false);
      }
    };

    if (ville && type) fetchResultats();
  }, [ville, type]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Bouton simple à la place de Navbar */}
      <div className="bg-white px-6 py-4 shadow-sm mt-4">
        <button
          onClick={() => navigate("/")}
          className="text-cyan-600 font-semibold text-sm hover:underline"
        >
          ← Retour à l’accueil
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">
          Résultats pour {type === "restaurant" ? "Restaurants" : "Hôtels"} à {ville}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Chargement en cours...</p>
        ) : resultats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resultats.map((etab) => (
              <div
                key={etab.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/etablissement/${etab.id}`)}
              >
                {etab.image ? (
                  <img
                    src={etab.image}
                    alt={etab.nom}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 italic">
                    Aucune image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{etab.nom}</h2>
                  <p className="text-sm text-gray-600">📍 {etab.adresse}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {etab.description?.slice(0, 100)}...
                  </p>
                  <span className="block mt-3 text-cyan-700 font-semibold text-sm">
                    Voir les détails →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Aucun établissement trouvé pour cette recherche.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}


