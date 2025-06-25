import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const avisVirtuels = [
  {
    nom: "Mouna L.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    note: 5,
    commentaire: "Expérience incroyable sur Luxvia ! Hôtel conforme, service rapide, je recommande sans hésiter.",
  },
  {
    nom: "Youssef B.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    note: 4,
    commentaire: "Interface fluide, réservation rapide. Petit bug corrigé immédiatement par le support. Merci !",
  },
  {
    nom: "Fatima Z.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    note: 5,
    commentaire: "J'ai pu réserver un restaurant en 2 minutes chrono. Luxvia est mon nouveau réflexe pour mes sorties.",
  },
  {
    nom: "Omar T.",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
    note: 4,
    commentaire: "Très pratique, surtout les filtres. Vivement l'application mobile Mais avant donnez nous 18 pleasseee😔!",
  },
];

export default function TemoignagesClients() {
  const [avisReels, setAvisReels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/avis/recents/")
      .then((res) => setAvisReels(res.data))
      .catch(() => console.warn("Impossible de charger les avis réels"));
  }, []);

  return (
    <div className="w-full px-6 py-16 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        💬 Ce que disent nos clients
      </h2>

      {/*  Avis virtuels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
        {avisVirtuels.map((avis, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={avis.image}
                alt={avis.nom}
                className="w-16 h-16 rounded-full object-cover mb-3 border"
              />
              <h4 className="font-semibold text-gray-800 dark:text-white">{avis.nom}</h4>
              <div className="flex items-center justify-center mt-1 mb-2">
                {[...Array(avis.note)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{avis.commentaire}</p>
            </div>
          </div>
        ))}
      </div>

      {/*  Avis réels dynamiques */}
      {avisReels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {avisReels.map((avis, index) => (
            <div
              key={avis.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-gray-700 dark:text-white">
                    {avis.client_prenom.charAt(0)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {avis.client_prenom} {avis.client_nom.charAt(0)}.
                </h4>
                <div className="flex items-center justify-center mt-1 mb-2">
                  {[...Array(avis.note)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{avis.commentaire}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
