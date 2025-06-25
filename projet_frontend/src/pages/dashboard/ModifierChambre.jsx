import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import SidebarGerantHotel from "../../components/SidebarGerantHotel";

export default function ModifierChambre() {
  const { chambreId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    capacite: "",
    disponible: true,
    superficie: "",
    services: [],
  });

  const [allServices, setAllServices] = useState([]);
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
          superficie: res.data.superficie || "",
          services: res.data.services || [],
          hotel: res.data.hotel
        });
      } catch (error) {
        console.error("Erreur chargement chambre:", error);
        setErrorMessage("Impossible de charger les données de la chambre.");
      }
    }

    async function fetchServices() {
      try {
        const res = await api.get(`/auth/etablissements/${formData.hotel}/services/`);
        setAllServices(res.data);
      } catch (err) {
        console.error("Erreur chargement services :", err);
      }
    }

    fetchChambre();
    fetchServices();
  }, [chambreId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image") {
      setImage(files[0]);
    } else if (type === "checkbox" && name.startsWith("service_")) {
      const serviceId = parseInt(name.split("_")[1]);
      const updatedServices = checked
        ? [...formData.services, serviceId]
        : formData.services.filter((id) => id !== serviceId);
      setFormData({ ...formData, services: updatedServices });
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
      if (key === "services") {
        formData.services.forEach((id) => data.append("services", id));
      } else {
        data.append(key, formData[key]);
      }
    }
    if (image) {
      data.append("image", image);
    }

    try {
      await api.patch(`/accounts/chambres/${chambreId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(-1); 
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
            <label className="block font-semibold">Superficie (m²)</label>
            <input
              type="number"
              name="superficie"
              value={formData.superficie}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {allServices.length > 0 && (
            <div className="mb-4">
              <label className="block font-semibold mb-1">Services supplémentaires</label>
              {allServices.map((service) => (
                <div key={service.id} className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    name={`service_${service.id}`}
                    checked={formData.services.includes(service.id)}
                    onChange={handleChange}
                  />
                  <label>{service.nom}</label>
                </div>
              ))}
            </div>
          )}

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

