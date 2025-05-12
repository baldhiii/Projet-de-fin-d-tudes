// 📁 src/pages/APropos.jsx
import { motion } from "framer-motion";
import Navbar from "../Navbar";

export default function APropos() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar
  isAuthenticated={false}
  setIsAuthenticated={() => {}}
  userPhoto={null}
/>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-6 py-20"
      >
        <h1 className="text-5xl font-extrabold mb-8 text-center text-cyan-600">
          ✨ Bienvenue sur Luxvia
        </h1>

        <p className="text-xl leading-relaxed mb-6 text-gray-700">
          Chez <span className="text-cyan-500 font-semibold">Luxvia</span>, nous croyons qu’un séjour inoubliable commence par une expérience de réservation fluide, élégante et sécurisée. C’est pourquoi nous avons imaginé une plateforme moderne qui allie simplicité, performance et fiabilité.
        </p>

        <p className="text-xl leading-relaxed mb-6 text-gray-700">
          Qu’il s’agisse de réserver un hôtel de charme à Marrakech ou une table gastronomique à Casablanca, Luxvia vous accompagne avec des services sur mesure, des avis authentiques et une interface pensée pour vous.
        </p>

        <div className="border-l-4 border-cyan-500 pl-4 italic text-gray-600 mb-8">
          "Plus qu’un simple outil de réservation, Luxvia est un compagnon de voyage digital conçu pour les amoureux de l’excellence."
        </div>

        <h2 className="text-3xl font-bold mb-4 text-gray-800">👨‍💻 Les créateurs derrière Luxvia</h2>
        <ul className="list-disc pl-6 text-lg text-gray-700">
          <li>
            <strong>Moustapha Koné</strong> — Ingénieur Backend, Authentification avancée, Réservations & Rôles
          </li>
          <li>
            <strong>Moussa Sangaré</strong> — Ingénieur Frontend, UI/UX Designer, Dashboards & Intégration Premium
          </li>
        </ul>

        <p className="text-xl mt-8 text-gray-700">
          Luxvia a été conçu dans le cadre de notre <strong>Projet de Fin d'Études</strong>, avec l’ambition de proposer une solution digitale complète et élégante, capable de répondre aux exigences réelles du marché.
        </p>
      </motion.div>
    </div>
  );
}

