import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RechercheResultats() {
  const [searchParams] = useSearchParams();
  const [resultats, setResultats] = useState([]);

  const ville = searchParams.get("ville");
  const type = searchParams.get("type");
  const date_debut = searchParams.get("date_debut");
  const date_fin = searchParams.get("date_fin");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recherche/", {
          params: {
            ville,
            type,
            date_debut,
            date_fin,
          },
        });
        setResultats(res.data);
      } catch (err) {
        console.error("Erreur recherche :", err);
      }
    };

    fetchData();
  }, [ville, type, date_debut, date_fin]);

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-cyan-700">
        Résultats à {ville}
      </h1>

      {resultats.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resultats.map((etab) => (
            <div key={etab.id} className="bg-white p-4 rounded-xl shadow">
              <img
                src={etab.image}
                alt={etab.nom}
                className="w-full h-[180px] object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold">{etab.nom}</h2>
              <p className="text-sm text-gray-600">{etab.description}</p>
              <p className="text-sm text-cyan-700 font-medium mt-1">
                {etab.type === "hotel" ? "Hôtel" : "Restaurant"} à {etab.destination}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucun établissement trouvé.</p>
      )}
    </div>
  );
}
