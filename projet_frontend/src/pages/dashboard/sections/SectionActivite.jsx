import { useEffect, useState } from "react";
import { FaClock, FaStar, FaCalendarCheck } from "react-icons/fa";
import { getActivitesRecentes } from "../../../services/dashboardService";

export default function SectionActivite() {
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getActivitesRecentes();
        setActivites(data);
      } catch (error) {
        console.error("Erreur chargement activité récente :", error);
      }
    };

    fetchData();
  }, []);

  if (!activites || activites.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
          <FaClock className="text-indigo-500" />
          Activité Récente
        </h2>
        <p className="text-gray-500">Aucune activité récente pour l’instant.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <FaClock className="text-indigo-500" />
        Activité Récente
      </h2>

      <ul className="space-y-4">
        {activites.map((act, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
              {act.type === "reservation" ? (
                <FaCalendarCheck className="w-5 h-5" />
              ) : (
                <FaStar className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {act.type === "reservation" ? "Réservation" : "Avis"} –{" "}
                <span className="text-cyan-700">{act.etablissement}</span>
              </p>
              <p className="text-sm text-gray-600">
                {act.type === "reservation"
                  ? `Statut : ${act.statut}`
                  : `Note donnée : ${act.note}/5`}
              </p>
              <p className="text-xs text-gray-500">
                Le {new Date(act.date).toLocaleDateString()} à{" "}
                {new Date(act.date).toLocaleTimeString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
