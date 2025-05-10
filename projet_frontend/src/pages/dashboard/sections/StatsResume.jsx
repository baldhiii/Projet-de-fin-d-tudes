import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaBed,
  FaUtensils,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { getClientStats } from "../../../services/dashboardService";

export default function StatsResume() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getClientStats();
        setStats(data);
      } catch (error) {
        console.error("Erreur chargement des statistiques :", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div className="text-center text-gray-500">Chargement des statistiques...</div>;
  }

  const statsArray = [
    {
      icon: <FaClipboardList className="text-blue-600 w-5 h-5" />,
      label: "Réservations totales",
      value: stats.total_reservations ?? "—",
      sub: `${stats.total_reservations ?? 0} réservation(s) au total`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: <FaBed className="text-yellow-600 w-5 h-5" />,
      label: "Réservations d'hôtel",
      value: stats.reservations_hotel ?? "—",
      sub: `${stats.reservations_hotel ?? 0} séjour(s)`,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      icon: <FaUtensils className="text-orange-600 w-5 h-5" />,
      label: "Réservations restaurant",
      value: stats.reservations_restaurant ?? "—",
      sub: `${stats.reservations_restaurant ?? 0} repas réservés`,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: <FaCheckCircle className="text-green-600 w-5 h-5" />,
      label: "Confirmées",
      value: stats.reservations_confirmees ?? "—",
      sub: `${stats.reservations_confirmees ?? 0} confirmée(s)`,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: <FaTimesCircle className="text-red-600 w-5 h-5" />,
      label: "Annulées",
      value: stats.reservations_annulees ?? "—",
      sub: `${stats.reservations_annulees ?? 0} annulée(s)`,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {statsArray.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-sm rounded-xl p-4 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${item.bg}`}>
              {item.icon}
            </div>
            <h3 className="font-semibold text-gray-700">{item.label}</h3>
          </div>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          <p className="text-sm text-gray-500">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

