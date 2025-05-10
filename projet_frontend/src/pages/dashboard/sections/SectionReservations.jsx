import { FaCalendarAlt, FaHotel, FaUtensils } from "react-icons/fa";

export default function SectionReservations({ reservations }) {
  if (!reservations || reservations.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Toutes vos réservations</h2>
        <p className="text-gray-500">Aucune réservation trouvée.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Toutes vos réservations</h2>

      <table className="min-w-full text-sm text-gray-700">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="py-3">Établissement</th>
            <th className="py-3">Type</th>
            <th className="py-3">Dates</th>
            <th className="py-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="py-3">
                <div className="font-medium text-cyan-700">{res.etablissement?.nom}</div>
              </td>
              <td className="py-3">
                <span className="inline-flex items-center gap-1">
                  {res.table ? (
                    <>
                      <FaUtensils className="text-orange-500" /> Restaurant
                    </>
                  ) : (
                    <>
                      <FaHotel className="text-yellow-500" /> Hôtel
                    </>
                  )}
                </span>
              </td>
              <td className="py-3">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-500" />
                  {new Date(res.date_debut).toLocaleDateString()} — {new Date(res.date_fin).toLocaleDateString()}
                </span>
              </td>
              <td className="py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    res.statut === "confirmee"
                      ? "bg-green-100 text-green-700"
                      : res.statut === "en_attente"
                      ? "bg-yellow-100 text-yellow-700"
                      : res.statut === "annulee"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {res.statut.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
