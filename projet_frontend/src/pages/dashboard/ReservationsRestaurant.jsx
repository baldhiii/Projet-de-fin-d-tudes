import { useEffect, useState } from "react";
import api from "../../services/api";
import SidebarGerantRestaurant from "../../components/restaurant/SidebarGerantRestaurant";

export default function ReservationsRestaurant() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/accounts/reservations-gerant-restaurant/");
        setReservations(res.data);
      } catch (error) {
        console.error("Erreur chargement réservations :", error);
      }
    };
    fetchReservations();
  }, []);

  const changerStatut = async (id, statut) => {
    try {
      await api.patch(`/accounts/reservations/${id}/`, { statut });
      setReservations(prev =>
        prev.map(r => (r.id === id ? { ...r, statut } : r))
      );
    } catch (err) {
      console.error("Erreur changement de statut :", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantRestaurant />

      <main className="flex-1 p-10 ml-64 pt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Réservations de vos Restaurants
        </h1>

        {reservations.length === 0 ? (
          <p className="text-gray-600">Aucune réservation disponible.</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Restaurant</th>
                <th className="px-4 py-2">Table</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2 text-gray-800">
                    {res.client?.first_name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-900 font-semibold">
                    {res.etablissement?.nom || (
                      <span className="text-gray-400">Non défini</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {res.table?.image ? (
                      <img
                        src={res.table.image}
                        alt="table"
                        className="w-10 h-10 object-cover rounded-md border"
                      />
                    ) : null}
                    <span className="text-cyan-700 font-medium">
                      {res.table?.numero
                        ? `Table ${res.table.numero} (${res.table.capacite} pers)`
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {res.date_debut
                      ? new Date(res.date_debut).toLocaleString("fr-FR")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full text-white ${
                        res.statut === "confirmee"
                          ? "bg-green-500"
                          : res.statut === "en_attente"
                          ? "bg-yellow-500"
                          : res.statut === "annulee"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {res.statut}
                    </span>
                    {res.statut === "en_attente" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => changerStatut(res.id, "confirmee")}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => changerStatut(res.id, "annulee")}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}



