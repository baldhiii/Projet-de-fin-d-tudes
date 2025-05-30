import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function TemoignagesClients() {
  const [avisReels, setAvisReels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/avis/recents/")
      .then((res) => setAvisReels(res.data))
      .catch((err) => console.error("Erreur chargement avis :", err));
  }, []);

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Ce que disent nos clients
        </h2>

        {/* 🔹 Avis fictifs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-gray-700 dark:text-white italic">
              “Expérience exceptionnelle ! Tout était parfait.”
            </p>
            <p className="mt-4 font-bold text-gray-900 dark:text-white">Fatima L.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-gray-700 dark:text-white italic">
              “Un site super pratique pour réserver hôtels et restos.”
            </p>
            <p className="mt-4 font-bold text-gray-900 dark:text-white">Youssef A.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
            <p className="text-gray-700 dark:text-white italic">
              “J’ai adoré le design et la fluidité de Luxvia.”
            </p>
            <p className="mt-4 font-bold text-gray-900 dark:text-white">Khadija M.</p>
          </div>
        </div>

        {/* ✅ Avis réels */}
        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
          Avis vérifiés des utilisateurs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avisReels.map((avis) => (
            <motion.div
              key={avis.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-700 dark:text-white mb-2 italic">
                “{avis.commentaire}”
              </p>
              <div className="flex items-center mb-1">
                {[...Array(avis.note)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{avis.client_prenom} {avis.client_nom}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
