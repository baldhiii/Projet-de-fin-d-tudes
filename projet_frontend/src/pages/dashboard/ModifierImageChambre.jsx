import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function ModifierImageChambre() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [imageActuelle, setImageActuelle] = useState(null);
  const [description, setDescription] = useState("");
  const [fichier, setFichier] = useState(null);

 
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`auth/image-chambres/${id}/`); 
        setImageActuelle(res.data.image);
        setDescription(res.data.description);
      } catch (err) {
        console.error("Erreur lors du chargement de l’image :", err);
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
      await api.patch(`auth/images-chambres/${id}/modifier/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Image modifiée avec succès !");
      navigate(-1);
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">🖼️ Modifier une image de chambre</h2>

      {imageActuelle && (
        <div className="mb-4 text-center">
          <p className="text-gray-600">Image actuelle :</p>
          <img
            src={imageActuelle}
            alt="Image actuelle"
            className="w-64 h-40 object-cover rounded mx-auto mt-2 border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">📝 Nouvelle description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ex : Vue sur la mer"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">📁 Remplacer l’image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFichier(e.target.files[0])}
            className="w-full"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            💾 Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
