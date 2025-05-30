import { useState, useEffect } from "react";
import api from "../../services/api"; // ton fichier Axios configuré
import { useParams, useNavigate } from "react-router-dom";

export default function ModifierImageChambre() {
  const { id } = useParams(); // ID de l’image à modifier
  const navigate = useNavigate();

  const [imageActuelle, setImageActuelle] = useState(null);
  const [description, setDescription] = useState("");
  const [fichier, setFichier] = useState(null);

  // Charger les infos actuelles de l’image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`/images-chambres/${id}/`);
        setImageActuelle(res.data.image);
        setDescription(res.data.description);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };

    fetchImage();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    if (fichier) {
      formData.append("image", fichier);
    }

    try {
      await api.patch(`/images-chambres/${id}/modifier/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Image modifiée avec succès !");
      navigate(-1); // ou redirect vers la liste des images
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Modifier l’image</h2>

      {imageActuelle && (
        <div className="mb-4">
          <p className="text-gray-600">Image actuelle :</p>
          <img
            src={imageActuelle}
            alt="Aperçu"
            className="w-64 rounded border mt-2"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nouvelle description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Remplacer l’image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFichier(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
