// 📁 src/pages/dashboard/AjouterTable.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AjouterTable() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numero: "",
    capacite: "",
    disponible: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
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
      data.append("restaurant", id); 
      data.append("numero", formData.numero);
      data.append("capacite", formData.capacite);
      data.append("disponible", formData.disponible);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await api.post("/accounts/tables/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(-1); 
    } catch (err) {
      console.error("Erreur ajout table :", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Ajouter une Table</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          placeholder="Numéro de table"
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

        {preview && (
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-40 object-cover rounded border mb-2"
          />
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Enregistrer la Table
        </button>
      </form>
    </div>
  );
}
