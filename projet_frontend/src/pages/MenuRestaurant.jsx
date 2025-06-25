import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MenuRestaurant() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [imageZoom, setImageZoom] = useState(null); 

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/auth/restaurants/${id}/menu/`)
      .then((res) => setMenu(res.data))
      .catch(() => console.error("Erreur chargement menu"));
  }, [id]);

  return (
    <div className="pt-28 px-6 py-10 max-w-6xl mx-auto relative">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
        🍽️ Menu du restaurant
      </h1>

      {menu.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menu.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow">
              {item.image && (
                <img
                  src={`http://localhost:8000${item.image}`}
                  alt={item.nom}
                  onClick={() => setImageZoom(`http://localhost:8000${item.image}`)}
                  className="w-full h-[200px] object-cover rounded-lg mb-4 cursor-pointer hover:scale-105 transition"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-800">{item.nom}</h3>
              <p className="text-gray-500">{item.description}</p>
              <p className="text-sm font-bold text-orange-700 mt-2">{item.prix} MAD</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  item.disponible ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.disponible ? "Disponible" : "Indisponible"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucun plat disponible.</p>
      )}

      
      {imageZoom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setImageZoom(null)}
        >
          <img
            src={imageZoom}
            alt="Aperçu du plat"
            className="max-w-3xl max-h-[80vh] rounded-xl shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
}
