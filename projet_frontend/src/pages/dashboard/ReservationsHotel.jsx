import { useEffect, useState } from "react";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";
import { motion } from "framer-motion";

export default function ReservationsHotel() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/accounts/reservations-gerant/");
      setReservations(res.data);
    } catch (error) {
      console.error("Erreur chargement réservations :", error);
    }
  };

  const changerStatut = async (id, nouveauStatut) => {
    try {
      await api.patch(`/accounts/reservations/${id}/changer_statut/`, {
        statut: nouveauStatut,
      });
      fetchReservations(); // mise à jour
    } catch (err) {
      console.error("Erreur changement statut :", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-6"
        >
          Réservations de vos Hôtels
        </motion.h1>

        {reservations.length === 0 ? (
          <p className="text-gray-600">Aucune réservation pour l’instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-left text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Hôtel</th>
                  <th className="px-4 py-3">Chambre</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b text-sm text-gray-700 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{r.client?.first_name || "N/A"}</td>
                    <td className="px-4 py-3">{r.etablissement?.nom}</td>
                    <td className="px-4 py-3">{r.chambre?.nom || "N/A"}</td>
                    <td className="px-4 py-3">
                      {r.date_debut ? (
                        <>
                          {new Date(r.date_debut).toLocaleDateString()} →{" "}
                          {new Date(r.date_fin).toLocaleDateString()}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${
                          r.statut === "confirmee"
                            ? "bg-green-500"
                            : r.statut === "en_attente"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {r.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.statut === "en_attente" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => changerStatut(r.id, "confirmee")}
                            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => changerStatut(r.id, "annulee")}
                            className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
                          >
                            Refuser
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
