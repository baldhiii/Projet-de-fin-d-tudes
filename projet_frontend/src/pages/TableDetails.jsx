import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaChair, FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);

  useEffect(() => {
    api.get(`/auth/tables/${id}/`)
      .then((res) => {
        console.log(" Table récupérée :", res.data);
        setTable(res.data);
      })
      .catch(() => console.error("Erreur récupération table"));
  }, [id]);

  if (!table) {
    return <div className="text-center p-10 text-gray-500">Chargement de la table...</div>;
  }

  // Vérifie si on a bien un ID d'établissement
  const etablissementId = typeof table.etablissement === "object" ? table.etablissement.id : table.etablissement;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-100 px-4 py-12 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">

        {/* Image */}
        {table.image ? (
          <img
            src={table.image}
            alt={`Table ${table.numero}`}
            className="w-full h-[320px] object-cover"
          />
        ) : (
          <div className="w-full h-[320px] bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
            Aucune image disponible
          </div>
        )}

        {/* Contenu */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
            <FaChair className="text-cyan-600" /> Table {table.numero}
          </h1>

          <div className="text-lg text-gray-700 space-y-3">
            <p className="flex items-center gap-2">
              <FaUsers className="text-cyan-500" />
              <span>Capacité : <strong>{table.capacite}</strong> personnes</span>
            </p>
            <p className="flex items-center gap-2">
              {table.disponible ? (
                <>
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-green-700 font-semibold">Disponible</span>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-red-600" />
                  <span className="text-red-700 font-semibold">Indisponible</span>
                </>
              )}
            </p>
          </div>

          
          <div className="text-center mt-10">
            <button
              onClick={() => {
                if (table.disponible) {
                  navigate(`/etablissements/${etablissementId}/reserver?table=${table.id}`);
                }
              }}
              disabled={!table.disponible}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition shadow-md ${
                table.disponible
                  ? "bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {table.disponible ? "Réserver cette table" : "Indisponible"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
