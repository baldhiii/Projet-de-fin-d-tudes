import { useEffect, useState } from "react";
import api from "../../services/api";
import SidebarGerantRestaurant from "../../components/restaurant/SidebarGerantRestaurant";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DashboardGerantRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const profileRes = await api.get("/auth/profile/");
      setUser(profileRes.data);

      const restoRes = await api.get("/auth/etablissements/");
      const restos = restoRes.data.filter((e) => e.type === "restaurant");
      setRestaurants(restos);

      const statsRes = await api.get("auth/dashboard/restaurant/overview/");
      setStats(statsRes.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantRestaurant />

      <main className="flex-1 p-8 ml-64 pt-20">
        {/* === 1. Informations du gérant === */}
        {user && (
          <motion.div
            className="bg-white rounded-xl shadow p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-2">{user.first_name} {user.last_name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-indigo-600 font-semibold">Rôle : Gérant de restaurant</p>
          </motion.div>
        )}

        {/* === 2. Statistiques globales === */}
        {stats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Revenu journalier</p>
              <p className="text-xl font-bold">{stats.revenu_journalier} €</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Clients actuels</p>
              <p className="text-xl font-bold">{stats.clients_actuels}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">Revenu moyen par table</p>
              <p className="text-xl font-bold">{stats.revenu_par_chambre} €</p>
            </div>
          </motion.div>
        )}

        {/* === 3. Liste des restaurants === */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes Restaurants</h1>
          <button
            onClick={() => navigate("/dashboard/restaurant/ajouter")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Ajouter un restaurant
          </button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((resto) => (
              <motion.div
                key={resto.id}
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img
                  src={resto.image || "https://via.placeholder.com/300x200"}
                  alt={resto.nom}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h2 className="text-xl font-semibold">{resto.nom}</h2>
                <p className="text-gray-500 text-sm">{resto.ville}</p>

                <div className="mt-4 flex gap-2">
                <button
  onClick={() => navigate(`/gerant/restaurant/${resto.id}/details`)}
  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
>
  Voir détails
</button>
                  <button
                    onClick={() => navigate(`/dashboard/restaurant/${resto.id}/tables`)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                  >
                    Gérer les tables
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
