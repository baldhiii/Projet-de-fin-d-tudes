import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function DetailsRestaurant() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    
    async function fetchData() {
      try {
        const [resEtab, resTables] = await Promise.all([
          api.get(`/accounts/etablissements/${id}/`),
          api.get(`/accounts/restaurants/${id}/tables/`)
        ]);
        setRestaurant(resEtab.data);
        setTables(resTables.data);
      } catch (error) {
        console.error("Erreur chargement infos restaurant :", error);
      }
    }
    fetchData();
  }, [id]);

  if (!restaurant) return <p>Chargement...</p>;

  return (
    <div className="p-6 pt-24">
      {/* Infos du restaurant */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{restaurant.nom}</h1>
      <p className="text-gray-600 mb-2">{restaurant.description}</p>
      <p className="text-gray-600 mb-6">📍 {restaurant.adresse}</p>

      {/* Liste des tables */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Tables du restaurant</h2>
        <button
          onClick={() => navigate(`/gerant/restaurant/${id}/ajouter-table`)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ➕ Ajouter une table
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white border p-4 rounded-xl shadow">
            {table.image && (
              <img
                src={table.image}
                alt={`Table ${table.numero}`}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-semibold">Table {table.numero}</h3>
            <p>Capacité : {table.capacite} personnes</p>
            <p className={`text-sm mt-1 ${table.disponible ? "text-green-600" : "text-red-600"}`}>
              {table.disponible ? "Disponible" : "Indisponible"}
            </p>
            <button
              onClick={() => navigate(`/gerant/table/${table.id}/modifier`)}
              className="mt-3 text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Modifier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
