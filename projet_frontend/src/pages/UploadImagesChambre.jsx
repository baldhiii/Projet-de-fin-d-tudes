import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function UploadImagesChambre() {
  const { id } = useParams(); // ID de la chambre récupéré depuis l’URL
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!files.length) {
      setError("Veuillez sélectionner au moins une image.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("chambre", id); // ✅ id bien passé comme string

        const response = await api.post("/auth/images-chambre/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status !== 201) {
          throw new Error("Erreur lors de l’upload.");
        }
      }

      setSuccess(true);
      setFiles([]);
    } catch (err) {
      console.error("Erreur upload :", err.response?.data || err.message);
      setError(
        err.response?.data?.chambre?.[0] ||
        err.response?.data?.image?.[0] ||
        "Erreur inconnue lors de l'envoi."
      );
    }

    setUploading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Ajouter des images à la chambre</h2>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
        className="mb-4"
      />

      {files.length > 0 && (
        <ul className="mb-4 text-gray-600 list-disc pl-5">
          {files.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-6 py-2 rounded-lg text-white ${
          uploading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {uploading ? "Téléchargement..." : "Envoyer les images"}
      </button>

      {success && (
        <p className="mt-4 text-green-600 font-medium">Images ajoutées avec succès !</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-medium">❌ {error}</p>
      )}
    </div>
  );
}
