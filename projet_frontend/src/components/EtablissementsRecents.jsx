import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function EtablissementsRecents() {
  const [etabs, setEtabs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/accounts/etablissements-recents/")
      .then((res) => setEtabs(res.data))
      .catch((err) => console.error("Erreur chargement récents :", err));
  }, []);

  if (etabs.length === 0) return null;

  return (
    <div className="px-6 mt-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          🆕 Nouveaux sur Luxvia
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {etabs.map((etab) => (
          <div
            key={etab.id}
            onClick={() => navigate(`/etablissement/${etab.id}`)}
            className="cursor-pointer rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transform hover:scale-105 transition duration-300"
          >
            {etab.image && (
              <img
                src={etab.image}
                alt={etab.nom}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {etab.nom}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                📍 {etab.adresse}
              </p>
              <p className="text-sm text-gray-500">{etab.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
