import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";

export default function ListeChambres() {
  const { id } = useParams(); 
  const [chambres, setChambres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChambres();
  }, [id]);

  const fetchChambres = async () => {
    try {
      const res = await api.get(`/accounts/etablissements/${id}/chambres/`);
      setChambres(res.data);
    } catch (error) {
      console.error("Erreur chargement chambres :", error);
    }
  };

  const toggleDisponibilite = async (chambreId, currentStatus) => {
    try {
      await api.patch(`/accounts/chambres/${chambreId}/`, {
        disponible: !currentStatus,
      });
      fetchChambres();
    } catch (error) {
      console.error("Erreur changement statut :", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64 pt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Chambres de l’établissement
        </h1>

        {/* pour ajouter une chambre */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(`/gerant/etablissement/${id}/ajouter-chambre`)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ➕ Ajouter une chambre
          </button>
        </div>

        {/* Voir la Liste des chambres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chambres.map((chambre) => (
            <div
              key={chambre.id}
              className="flex items-center justify-between bg-white shadow-md rounded-xl p-6 border border-gray-200"
            >
              {/* Gauche : contenu chambre */}
              <div className="flex-1 pr-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  🛏️ {chambre.nom}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {chambre.description}
                </p>
                <p className="text-sm text-gray-600">💶 {chambre.prix} MAD — 👥 {chambre.capacite} pers</p>
                <p className="text-sm text-gray-600 mb-3">
                  {chambre.disponible ? "✅ Disponible" : "❌ Indisponible"}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/gerant/chambre/${chambre.id}/modifier`)}
                    className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => toggleDisponibilite(chambre.id, chambre.disponible)}
                    className={`px-4 py-1 text-sm text-white rounded ${
                      chambre.disponible ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {chambre.disponible ? "Rendre indisponible" : "Rendre disponible"}
                  </button>

                  <button
                    onClick={() => navigate(`/dashboard/gerant/chambre/${chambre.id}/images`)}
                    className="px-4 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
                  >
                    📷 Ajouter des photos
                  </button>
                  <button
  onClick={() => {
    const imageId = chambre.images?.[0]?.id;
    if (imageId) {
      navigate(`/dashboard/images-chambres/${imageId}/modifier`);
    } else {
      alert("Aucune image à modifier.");
    }
  }}
  className="px-4 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
>
  ✏️ Modifier les photos
</button>

                </div>
              </div>

              {/* Droite : image chambre */}
              {chambre.image && (
                <img
                  src={`http://127.0.0.1:8000${chambre.image}`}
                  alt={`Image ${chambre.nom}`}
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

