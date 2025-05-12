import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";

export default function ToutesChambres() {
  const [chambres, setChambres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChambres();
  }, []);

  const fetchChambres = async () => {
    try {
      const res = await api.get("/accounts/etablissements/");
      const etablissements = res.data;

      const allChambres = [];

      for (const hotel of etablissements) {
        const chambresRes = await api.get(`/accounts/etablissements/${hotel.id}/chambres/`);
        const chambresAvecHotel = chambresRes.data.map((c) => ({
          ...c,
          hotelNom: hotel.nom,
        }));
        allChambres.push(...chambresAvecHotel);
      }

      setChambres(allChambres);
    } catch (error) {
      console.error("Erreur chargement chambres :", error);
    }
  };

  const toggleDisponibilite = async (id, currentStatus) => {
    try {
      await api.patch(`/accounts/chambres/${id}/`, {
        disponible: !currentStatus,
      });
      fetchChambres();
    } catch (error) {
      console.error("Erreur mise à jour :", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Toutes les chambres</h1>
          <button
            onClick={() => navigate("/gerant/ajouter-chambre")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ➕ Ajouter une chambre
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-left text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Capacité</th>
                <th className="px-4 py-3">Prix/nuit</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chambres.map((chambre) => (
                <tr key={chambre.id} className="border-t">
                  <td className="px-4 py-2">{chambre.nom}</td>
                  <td className="px-4 py-2">{chambre.description}</td>
                  <td className="px-4 py-2">{chambre.capacite} pers.</td>
                  <td className="px-4 py-2">{chambre.prix} MAD</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        chambre.disponible
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {chambre.disponible ? "Disponible" : "Indisponible"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/gerant/chambre/${chambre.id}/modifier`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() =>
                        toggleDisponibilite(chambre.id, chambre.disponible)
                      }
                      className={`px-3 py-1 text-sm rounded text-white ${
                        chambre.disponible
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {chambre.disponible ? "Indispo." : "Dispo."}
                    </button>
                  </td>
                </tr>
              ))}
              {chambres.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Aucune chambre trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
