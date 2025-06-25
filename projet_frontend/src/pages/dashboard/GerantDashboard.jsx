import { useEffect, useState } from "react";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";
import DernieresReservations from "../../components/DernieresReservations";
import {
  FaEuroSign,
  FaUsers,
  FaChartLine,
  FaBed,
  FaBroom,
  FaTools,
  FaUserCircle,
  FaEnvelope,
} from "react-icons/fa";
import api from "../../services/api";

export default function DashboardGerantHotel() {
  const [stats, setStats] = useState(null);
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resStats, resProfil] = await Promise.all([
          api.get("auth/gerant/dashboard/overview/"),
          api.get("/auth/profile/"),
        ]);
        setStats(resStats.data);
        setProfil(resProfil.data);
      } catch (error) {
        console.error("Erreur chargement dashboard :", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64 pt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Vue d’ensemble de votre établissement
        </h1>

        {/* === pour infos du gérant === */}
        {profil && (
          <div className="bg-white shadow rounded-xl p-6 mb-6 flex items-center gap-6">
            <FaUserCircle className="text-5xl text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {profil.first_name} {profil.last_name}
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FaEnvelope /> {profil.email}
              </p>
              <p className="text-sm text-gray-600">Rôle : Gérant d’hôtel</p>
            </div>
          </div>
        )}

        {/* === et là Statistiques principales === */}
        {stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                  <FaEuroSign className="text-3xl text-green-600" />
                  <div>
                    <p className="text-gray-500 text-sm">Revenu journalier</p>
                    <h2 className="text-2xl font-bold">
                      {stats.revenu_journalier.toLocaleString()} €
                    </h2>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                  <FaUsers className="text-3xl text-orange-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Clients actuels</p>
                    <h2 className="text-2xl font-bold">
                      {stats.clients_actuels}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                  <FaChartLine className="text-3xl text-indigo-600" />
                  <div>
                    <p className="text-gray-500 text-sm">
                      Revenu moyen par chambre
                    </p>
                    <h2 className="text-2xl font-bold">
                      {stats.revenu_par_chambre.toLocaleString()} €
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* === Occupation des chambres === */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Occupation des chambres
              </h2>

              <div className="space-y-4">
                {stats.occupation_chambres.map((item, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-800">
                      {item.type} ({item.occupees}/{item.total}) —{" "}
                      {Math.round((item.occupees / item.total) * 100)}%
                    </p>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full"
                        style={{
                          width: `${
                            (item.occupees / item.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex gap-4">
                      <span>
                        <FaBroom className="inline mr-1" /> Nettoyage :{" "}
                        {item.en_nettoyage}
                      </span>
                      <span>
                        <FaTools className="inline mr-1" /> Maintenance :{" "}
                        {item.maintenance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/*  Réservations récentes */}
            <DernieresReservations />
          </>
        )}
      </main>
    </div>
  );
}

