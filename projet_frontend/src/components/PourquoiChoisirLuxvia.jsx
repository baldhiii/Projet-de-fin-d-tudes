// 📁 src/components/PourquoiChoisirLuxvia.jsx
import { ShieldCheck, Star, Smartphone, Settings2 } from "lucide-react";

export default function PourquoiChoisirLuxvia() {
  const avantages = [
    {
      titre: "Paiement 100% sécurisé",
      description: "Luxvia utilise Stripe pour garantir la sécurité de chaque transaction.",
      icone: ShieldCheck,
    },
    {
      titre: "Avis clients vérifiés",
      description: "Les commentaires proviennent uniquement d'utilisateurs ayant réellement réservé.",
      icone: Star,
    },
    {
      titre: "Support 24h/7",
      description: "Notre équipe d’assistance est disponible à toute heure, tous les jours.",
      icone: Settings2,
    },
    {
      titre: "Disponible bientôt sur mobile",
      description: "Luxvia arrive sur iOS & Android. Restez connecté !",
      icone: Smartphone,
    },
  ];

  return (
    <div className="w-full px-6 py-16 bg-gray-100 dark:bg-gray-900 mt-0">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        ✨ Pourquoi choisir <span className="text-cyan-500">Luxvia</span> ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {avantages.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
          >
            <item.icone className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {item.titre}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
