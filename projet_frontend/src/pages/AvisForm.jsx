import { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function AvisForm({ etablissementId }) {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("access") || localStorage.getItem("accessToken");

    if (!token) {
      setMessage("❌ Vous devez être connecté pour laisser un avis.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/auth/avis/ajouter/",
        {
          note,
          commentaire,
          etablissement: etablissementId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Merci pour votre avis !");
      setNote(0);
      setCommentaire("");
    }  catch (err) {
        console.error("Erreur serveur :", err.response?.data); // ← ajoute ceci
        if (err.response?.status === 401) {
          setMessage("❌ Non autorisé. Veuillez vous reconnecter.");
        } else if (err.response?.data?.detail) {
          setMessage(`❌ ${err.response.data.detail}`);
        } else {
          setMessage("❌ Une erreur est survenue. Essayez encore.");
        }
    
      
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Laisser un avis
      </h3>

      {message && <p className="mb-4 text-sm text-center">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((val) => (
            <Star
              key={val}
              className={`w-6 h-6 cursor-pointer ${
                note >= val ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setNote(val)}
            />
          ))}
        </div>

        <textarea
          className="w-full p-3 rounded border border-gray-300 dark:bg-gray-700 dark:text-white mb-4"
          rows="4"
          placeholder="Écrivez votre commentaire ici..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-900 transition"
        >
          Envoyer l’avis
        </button>
      </form>
    </div>
  );
}

