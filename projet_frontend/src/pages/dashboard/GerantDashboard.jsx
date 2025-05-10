import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaHotel,
  FaPlusCircle,
  FaUserCog,
  FaCalendarCheck,
  FaConciergeBell,
  FaClock,
  FaChartBar,
} from "react-icons/fa";

function GerantDashboard() {
  const navigate = useNavigate();
  const [gerantNom, setGerantNom] = useState("");
  const [hotels, setHotels] = useState([
    { id: 1, nom: "Hôtel Atlas", ville: "Marrakech" },
    { id: 2, nom: "Riad Majorelle", ville: "Fès" },
  ]);
  const [reservations, setReservations] = useState(17); // exemple

  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const parsed = JSON.parse(userProfile);
      setGerantNom(parsed.first_name || parsed.username || "Gérant");
    }
  }, []);

  const cards = [
    {
      icon: <FaHotel className="text-indigo-600 text-3xl" />,
      title: "Mes Hôtels",
      desc: `${hotels.length} établissements enregistrés`,
      onClick: () => navigate("/gerant/etablissements"),
    },
    {
      icon: <FaPlusCircle className="text-green-600 text-3xl" />,
      title: "Ajouter un Hôtel",
      desc: "Publiez un nouvel établissement",
      onClick: () => navigate("/gerant/ajouter-etablissement"),
    },
    {
      icon: <FaCalendarCheck className="text-blue-600 text-3xl" />,
      title: "Réservations",
      desc: `${reservations} réservations reçues`,
      onClick: () => navigate("/gerant/reservations"),
    },
    {
      icon: <FaUserCog className="text-purple-600 text-3xl" />,
      title: "Profil Établissement",
      desc: "Modifier les infos de l’établissement",
      onClick: () => navigate("/gerant/etablissement/profil"),
    },
    {
      icon: <FaConciergeBell className="text-yellow-600 text-3xl" />,
      title: "Services Proposés",
      desc: "Ajouter ou modifier les services",
      onClick: () => navigate("/gerant/services"),
    },
    {
      icon: <FaClock className="text-pink-600 text-3xl" />,
      title: "Disponibilités",
      desc: "Configurer jours et horaires ouverts",
      onClick: () => navigate("/gerant/disponibilites"),
    },
    {
      icon: <FaChartBar className="text-orange-600 text-3xl" />,
      title: "Statistiques",
      desc: "Suivre taux de réservation et revenus",
      onClick: () => navigate("/gerant/statistiques"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] to-[#ffffff] p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl px-10 py-12"
      >
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-800">
            🏨 Bienvenue, <span className="text-indigo-600">{gerantNom}</span>
          </h1>
          <p className="text-gray-700 mt-2">
            Gérez vos hôtels, vos services et vos réservations depuis cet espace dédié.
          </p>
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cards.slice(0, 6).map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.onClick}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-indigo-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-3">
                {card.icon}
                <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </motion.div>
          ))}

          {/* Centrer la carte Statistiques sur une nouvelle ligne */}
          <div></div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={cards[6].onClick}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-indigo-200 transition cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              {cards[6].icon}
              <h3 className="text-xl font-semibold text-gray-800">{cards[6].title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{cards[6].desc}</p>
          </motion.div>
          <div></div>
        </div>

        {/* Liste des hôtels */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">📋 Vos Hôtels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {hotels.map((hotel) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={hotel.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-800">{hotel.nom}</h3>
                <p className="text-sm text-gray-600 mb-4">📍 {hotel.ville}</p>
                <div className="flex gap-4 mt-2">
                  <button
                    className="text-sm px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    onClick={() => navigate(`/gerant/hotel/${hotel.id}/chambres`)}
                  >
                    Gérer les chambres
                  </button>
                  <button className="text-sm px-4 py-1 border border-gray-400 rounded-lg hover:bg-gray-100">
                    Modifier
                  </button>
                  <button className="text-sm px-4 py-1 text-red-600 hover:underline">
                    Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default GerantDashboard;
