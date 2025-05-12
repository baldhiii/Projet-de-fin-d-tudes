// 📁 src/pages/dashboard/ConfigurationHotel.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";
import { useNavigate } from "react-router-dom";

export default function ConfigurationHotel() {
  const [etablissements, setEtablissements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEtablissements() {
      try {
        const response = await api.get("/accounts/etablissements/hotels/");
setEtablissements(response.data);
      } catch (error) {
        console.error("Erreur chargement hôtels gérant:", error);
      }
    }
    fetchEtablissements();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Configuration de vos Hôtels
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/gerant/ajouter-etablissement")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ➕ Ajouter un hôtel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {etablissements.map((hotel) => (
            <div
              key={hotel.id}
              className="flex items-center justify-between bg-white shadow-md rounded-xl p-6 border border-gray-200"
            >
              {/* Gauche : contenu */}
              <div className="flex-1 pr-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  🏨 {hotel.nom}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  📍 {hotel.adresse} — {hotel.destination?.ville || "Sans ville"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {hotel.description}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/gerant/etablissement/${hotel.id}/modifier`)
                    }
                    className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/gerant/etablissement/${hotel.id}/chambres`)

                    }
                    className="px-4 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Gérer Chambres
                  </button>
                </div>
              </div>

              {/* Droite : image */}
              {hotel.image && (
                <img
                  src={hotel.image}
                  alt={`Image de ${hotel.nom}`}
                  className="w-28 h-28 object-cover rounded-lg border border-gray-300"
                />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


