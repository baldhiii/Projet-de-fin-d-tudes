import { motion } from "framer-motion";
import { FaUsers, FaHotel, FaCalendarAlt, FaTools } from "react-icons/fa";

function AdminDashboard({ nom = "Administrateur" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] via-[#ebedee] to-[#e2ebf0] p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl bg-white/70 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl px-10 py-14"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-3">
            🛠️ Bienvenue, <span className="text-blue-700">{nom}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Espace de supervision globale du système de réservation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Utilisateurs */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-md border border-blue-100"
          >
            <FaUsers className="text-blue-600 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-blue-800">Utilisateurs</h3>
            <p className="text-3xl font-bold text-blue-900 text-center mt-2">120</p>
          </motion.div>

          {/* Hôtels */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-md border border-purple-100"
          >
            <FaHotel className="text-purple-600 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-purple-800">Hôtels</h3>
            <p className="text-3xl font-bold text-purple-900 text-center mt-2">35</p>
          </motion.div>

          {/* Réservations */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-md border border-green-100"
          >
            <FaCalendarAlt className="text-green-600 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-green-800">Réservations</h3>
            <p className="text-3xl font-bold text-green-900 text-center mt-2">180</p>
          </motion.div>

          {/* Paramètres système */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl shadow-md border border-red-100"
          >
            <FaTools className="text-red-600 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-red-800">Paramètres</h3>
            <button className="text-sm text-red-700 mt-3 hover:underline">Gérer</button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
