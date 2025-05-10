import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

export default function ProfilPerso({ user }) {
  const navigate = useNavigate();

  const dateAdhesion = user?.date_joined
    ? new Date(user.date_joined).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      })
    : "Inconnue";

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Profil Personnel</h2>
          <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
        </div>
        <button
          onClick={() => navigate("/moncompte")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          Modifier
        </button>
      </div>

      <div className="mt-6 space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white">
            {user?.first_name?.charAt(0).toUpperCase() ?? "U"}
            {user?.last_name?.charAt(0).toUpperCase() ?? ""}
          </div>
          <div>
            <p className="font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500">Membre depuis {dateAdhesion}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaEnvelope className="text-yellow-600" />
          <span>{user?.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaPhone className="text-yellow-600" />
          <span>{user?.telephone || "Non renseigné"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-yellow-600" />
          <span>Date d’inscription : {dateAdhesion}</span>
        </div>
      </div>
    </div>
  );
}
