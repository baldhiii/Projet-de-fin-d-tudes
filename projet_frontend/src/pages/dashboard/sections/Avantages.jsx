import { FaGift } from "react-icons/fa";

export default function Avantages({ avantages }) {
  
  if (!Array.isArray(avantages) || avantages.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
          <FaGift className="text-purple-500" />
          Avantages disponibles
        </h2>
        <p className="text-gray-500">Aucun avantage disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <FaGift className="text-purple-500" />
        Avantages disponibles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {avantages.map((avantage) => (
          <div
            key={avantage.id}
            className="border rounded-xl p-4 bg-purple-50 hover:bg-purple-100 transition shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-purple-800">{avantage.titre}</h3>
              <p className="text-sm text-gray-600 mb-3">{avantage.description}</p>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <span className="text-sm font-semibold text-purple-600">
                {avantage.points_requis} pts
              </span>
              <button
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition"
                disabled={!avantage.disponible}
              >
                {avantage.disponible ? "Utiliser" : "Indisponible"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
