import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";

export default function AjouterEtablissement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    destination: "",
    adresse: "",
    telephone: "",
    image: null,
    type: "hotel",
  });

  const [destinations, setDestinations] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await api.get("/accounts/destinations/");
        setDestinations(res.data);
      } catch (error) {
        console.error("Erreur chargement destinations:", error);
      }
    }
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === "destination") {
        data.append("destination", parseInt(formData.destination)); // 👈 important
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await api.post("/accounts/etablissements/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (error) {
      console.error("Erreur création hôtel:", error);
      setErrorMessage("Une erreur est survenue. Vérifiez les champs ou le token.");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarGerantHotel />
        <main className="flex-1 p-10 ml-64 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-green-600 mb-6">
            Hôtel ajouté avec succès !
          </h2>
          <button
            onClick={() => navigate("/gerant/configuration")}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Retour à la configuration
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Ajouter un Hôtel</h1>

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
            <label className="block font-semibold">Ville (Destination)</label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            >
              <option value="">-- Choisir une ville --</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.ville}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Adresse</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Image principale</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="w-full mt-1"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            >
              <option value="hotel">Hôtel</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Enregistrer l'établissement
          </button>
        </form>
      </main>
    </div>
  );
}

