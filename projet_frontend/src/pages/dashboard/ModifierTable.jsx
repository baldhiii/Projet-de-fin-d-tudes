import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ModifierTable() {
  const { id } = useParams(); // ID de la table
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numero: "",
    capacite: "",
    disponible: false,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    async function fetchTable() {
      try {
        const res = await api.get(`/accounts/tables/${id}/`);
        setFormData({
          numero: res.data.numero,
          capacite: res.data.capacite,
          disponible: res.data.disponible,
          image: null, // on ne précharge pas de fichier, juste l’URL visuelle
        });
        setImagePreview(res.data.image || null);
      } catch (err) {
        console.error("Erreur lors du chargement de la table :", err);
      }
    }

    fetchTable();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("numero", formData.numero);
      data.append("capacite", formData.capacite);
      data.append("disponible", formData.disponible);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await api.put(`/accounts/tables/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(-1); // retour à la page précédente
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Modifier la Table</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          placeholder="Numéro de la table"
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="capacite"
          value={formData.capacite}
          onChange={handleChange}
          placeholder="Capacité"
          className="w-full border rounded px-3 py-2"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="disponible"
            checked={formData.disponible}
            onChange={handleChange}
          />
          Disponible
        </label>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Image actuelle"
            className="w-full h-40 object-cover rounded-lg border mb-2"
          />
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

