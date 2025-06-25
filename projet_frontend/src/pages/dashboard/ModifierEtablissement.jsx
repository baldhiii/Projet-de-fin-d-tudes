import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";

export default function ModifierEtablissement() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    adresse: "",
    telephone: "",
    type: "hotel",
  });

  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [resEtab, resDest] = await Promise.all([
          api.get(`/accounts/etablissements/${id}/`),
          api.get("/accounts/destinations/")
        ]);

        const etab = resEtab.data;
        setFormData({
          nom: etab.nom,
          description: etab.description,
          adresse: etab.adresse,
          telephone: etab.telephone,
          type: etab.type,
        });
        setDestinationId(etab.destination?.id || "");
        setDestinations(resDest.data);
      } catch (err) {
        console.error("Erreur chargement établissement ou destinations:", err);
        setErrorMessage("Erreur de chargement des données");
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImage(files[0]);
    } else if (name === "destination") {
      setDestinationId(value);
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

    const destinationValue = parseInt(destinationId);
    if (!isNaN(destinationValue)) {
      data.append("destination", destinationValue);
    }

    console.log("Payload envoyé :", [...data.entries()]); 

    try {
      await api.patch(`/accounts/etablissements/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/gerant/configuration");
    } catch (error) {
      console.error("Erreur mise à jour établissement:", error);
      setErrorMessage("Erreur lors de la mise à jour de l'établissement.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGerantHotel />
      <main className="flex-1 p-10 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Modifier l’Hôtel</h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
          <div className="mb-4">
            <label className="block font-semibold">Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" required />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Ville (Destination)</label>
            <select name="destination" value={destinationId} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" required>
              <option value="">-- Choisir une ville --</option>
              {destinations.map(dest => (
                <option key={dest.id} value={dest.id}>{dest.ville}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Adresse</label>
            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Téléphone</label>
            <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Image principale (facultatif)</label>
            <input type="file" name="image" onChange={handleChange} accept="image/*"
              className="w-full mt-1" />
          </div>

          <div className="mb-6">
            <label className="block font-semibold">Type</label>
            <select name="type" value={formData.type} onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2" required>
              <option value="hotel">Hôtel</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Enregistrer les modifications
          </button>
        </form>
      </main>
    </div>
  );
}
