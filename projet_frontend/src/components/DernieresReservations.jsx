import { useEffect, useState } from "react";
import api from "../services/api"; 

export default function ReservationsRecente() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await api.get("auth/gerant/dashboard/dernieres-reservations/");

        setReservations(response.data);
      } catch (error) {
        console.error("Erreur chargement réservations :", error);
      }
    }
    fetchReservations();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Réservations récentes</h2>
        <button className="text-sm text-indigo-600 hover:underline">Voir tout</button>
      </div>

      <div className="space-y-4">
        {reservations.map((res, index) => (
          <div key={index} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{res.client}</p>
                <p className="text-sm text-gray-500">
                  Du {new Date(res.date_debut).toLocaleDateString()} au {new Date(res.date_fin).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {res.montant ? `${res.montant} €` : "N/A"}
                </p>
                <p
                  className={`text-sm font-medium ${
                    res.statut === "confirmee"
                      ? "text-green-600"
                      : res.statut === "en_attente"
                      ? "text-yellow-500"
                      : res.statut === "annulee"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {res.statut}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
