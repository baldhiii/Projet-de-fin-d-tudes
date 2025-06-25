import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfilPerso from "./sections/ProfilPerso";
import StatsFidelite from "./sections/StatsFidelite";
import SectionActivite from "./sections/SectionActivite";
import Avantages from "./sections/Avantages";
import api from "../../services/api";
import StatsResume from "./sections/StatsResume";
import SectionReservations from "./sections/SectionReservations";

import {
  FaCalendarAlt,
  FaHeart,
  FaHistory,
  FaUser,
  FaComments,
  FaHome,
} from "react-icons/fa";

export default function ClientDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [activites, setActivites] = useState([]);
  const [avantages, setAvantages] = useState([]);
  const [ongletActif, setOngletActif] = useState("reservations");

  useEffect(() => {
    api.get("/auth/dashboard/mes-reservations/").then((res) => setReservations(res.data));
    api.get("/auth/dashboard/activites-recentes/").then((res) => setActivites(res.data));
    api.get("/auth/dashboard/avantages/").then((res) => setAvantages(res.data));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#fefefe] to-[#f3f7fa]">
      {/* === MENU LATÉRAL === */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-yellow-600 mb-8">LUXVIA</h1>
        <ul className="space-y-4 text-gray-700 text-sm font-medium">
          <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/dashboard/client")}>
            <FaHome /> Tableau de bord
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-600" onClick={() => setOngletActif("reservations")}>
            <FaCalendarAlt /> Réservations
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-600" onClick={() => navigate("/moncompte")}>
            <FaUser /> Profil
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
            <FaHeart /> Favoris
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
            <FaHistory /> Historique
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
            <FaComments /> Messages
          </li>
        </ul>
        <div className="mt-20 border-t pt-4">
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* === CONTENU PRINCIPAL === */}
      <main className="flex-1 p-6 pt-28 space-y-6">
        {/* 📦 PROFIL + FIDÉLITÉ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfilPerso user={user} />
          </div>
          <StatsFidelite />
        </div>

        {/*  STATS + ONGLET SWITCH */}
        <div className="mt-4">
          <StatsResume />

          <div className="mt-6 border-b border-gray-200 flex gap-6">
            <button
              className={`py-2 px-4 border-b-2 transition font-medium ${
                ongletActif === "reservations" ? "border-yellow-500 text-yellow-600" : "text-gray-500"
              }`}
              onClick={() => setOngletActif("reservations")}
            >
              Réservations
            </button>
            <button
              className={`py-2 px-4 border-b-2 transition font-medium ${
                ongletActif === "activite" ? "border-yellow-500 text-yellow-600" : "text-gray-500"
              }`}
              onClick={() => setOngletActif("activite")}
            >
              Activité récente
            </button>
            <button
              className={`py-2 px-4 border-b-2 transition font-medium ${
                ongletActif === "fidelite" ? "border-yellow-500 text-yellow-600" : "text-gray-500"
              }`}
              onClick={() => setOngletActif("fidelite")}
            >
              Programme fidélité
            </button>
          </div>

          {/*  CONTENU PAR ONGLET */}
          <div className="mt-4">
            {ongletActif === "reservations" && <SectionReservations reservations={reservations} />}
            {ongletActif === "activite" && <SectionActivite activites={activites} />}
            {ongletActif === "fidelite" && <Avantages avantages={avantages} />}
          </div>
        </div>
      </main>
    </div>
  );
}
