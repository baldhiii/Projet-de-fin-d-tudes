import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";

export default function ModifierChambre() {
  const { chambreId } = useParams(); // ✅ ID correct récupéré depuis l'URL
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

  useEffect(() => {
    async function fetchChambre() {
      try {
        const res = await api.get(`/accounts/chambres/${chambreId}/`);
        setFormData({
          nom: res.data.nom,
          description: res.data.description,
          prix: res.data.prix,
          capacite: res.data.capacite,
          disponible: res.data.disponible,
        });
      } catch (error) {
        console.error("Erreur chargement chambre:", error);
        setErrorMessage("Impossible de charger les données de la chambre.");
      }
    }

    fetchChambre();
  }, [chambreId]);

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
    if (image) {
      data.append("image", image);
    }

    try {
      await api.patch(`/accounts/chambres/${chambreId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(-1); // 🔁 retour à la page précédente
    } catch (error) {
      console.error("Erreur mise à jour chambre:", error);
      setErrorMessage("Erreur lors de la modification de la chambre.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Modifier la chambre</h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMessage}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl"
        >
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
            Enregistrer
          </button>
        </form>
      </main>
    </div>
  );
}

