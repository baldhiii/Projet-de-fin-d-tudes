import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion } from "framer-motion";

export default function AjouterRestaurantForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    adresse: "",
    telephone: "",
    destination: "", // ID destination
    type: "restaurant", // Fixé
  });

  const [image, setImage] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get("/auth/destinations/");
        setDestinations(response.data);
      } catch (err) {
        console.error("Erreur chargement destinations :", err);
      }
    };
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImage(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      if (value !== "") {
        data.append(key, value);
      }
    }

    if (image) {
      data.append("image", image);
    }

    try {
      await api.post("/accounts/etablissements/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Restaurant ajouté avec succès !");
      navigate("/dashboard/restaurant");
    } catch (error) {
      console.error("Erreur ajout restaurant :", error);
      setErrorMessage("Échec lors de l’ajout du restaurant.");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Ajouter un restaurant
        </h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nom"
            placeholder="Nom du restaurant"
            value={formData.nom}
            onChange={handleChange}
            className="input w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="textarea w-full border border-gray-300 rounded px-3 py-2"
          />

          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="select w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Choisir une destination --</option>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.ville}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="input w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="tel"
            name="telephone"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
            className="input w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
          >
            Enregistrer
          </button>
        </form>
      </motion.div>
    </div>
  );
}

