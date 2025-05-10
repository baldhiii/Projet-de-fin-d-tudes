import { useEffect, useState } from "react";
import api from "../../../services/api";
import { FaMedal } from "react-icons/fa";

export default function StatsFidelite() {
  const [points, setPoints] = useState(0);
  const [statut, setStatut] = useState("Bronze");

  useEffect(() => {
    api.get("auth/dashboard/stats-client/").then((res) => {
      setPoints(res.data.points_fidelite || 0);
      setStatut(res.data.statut || "Bronze");
    });
  }, []);

  const getNiveauSuivant = (pts) => {
    if (pts >= 2000) return "Platinum";
    if (pts >= 1000) return "Gold";
    if (pts >= 500) return "Silver";
    return "Bronze";
  };

  const getPourcentage = (pts) => {
    const max = 1000;
    return Math.min(100, (pts / max) * 100);
  };

  const niveau = getNiveauSuivant(points);
  const progression = getPourcentage(points);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Programme Fidélité</h2>
        <FaMedal className="text-yellow-500 text-2xl" />
      </div>

      <p className="text-sm text-gray-600 mb-4">Statut actuel : <span className="font-semibold text-yellow-600">{statut}</span></p>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progression}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 mb-1">
        {points} points sur {niveau === "Gold" ? "2000" : "1000"} pour atteindre <span className="font-semibold">{niveau}</span>
      </p>
      <p className="text-xs text-gray-400">Plus vous réservez, plus vous gagnez !</p>
    </div>
  );
}
