import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";

export default function AjouterChambre() {
  const { etabId } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    capacite: "",
    disponible: true,
  });

  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image") {
      setImage(files[0]);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    
    data.append("hotel", etabId);

    if (image) {
      data.append("image", image);
    }

    try {
      await api.post("/accounts/chambres/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(-1); 
    } catch (error) {
      console.error("Erreur lors de l'ajout de la chambre:", error);
      setErrorMessage("Une erreur est survenue. Veuillez vérifier les champs.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64 pt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Ajouter une chambre</h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
          <div className="mb-4">
            <label className="block font-semibold">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Prix</label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Capacité</label>
            <input
              type="number"
              name="capacite"
              value={formData.capacite}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Image (optionnel)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full mt-1"
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="font-semibold">Disponible</label>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Ajouter la chambre
          </button>
        </form>
      </main>
    </div>
  );
}
