import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function GererMenu() {
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    restaurant: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/auth/gerant/menu/");
      setMenu(res.data);
      if (res.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          restaurant: res.data[0].restaurant,
        }));
      }
    } catch (error) {
      toast.error("Erreur chargement menu");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (isEditing && selectedId) {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://127.0.0.1:8000/api/auth/gerant/menu/${selectedId}/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        });
        toast.success("Plat modifié !");
      } else {
        await api.post("/auth/gerant/menu/", data);
        toast.success("Plat ajouté !");
      }
      fetchMenu();
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (plat) => {
    setFormData({
      nom: plat.nom,
      description: plat.description,
      prix: plat.prix,
      restaurant: plat.restaurant,
      image: null,
    });
    setImagePreview(plat.image ? `http://127.0.0.1:8000${plat.image}` : null);
    setIsEditing(true);
    setSelectedId(plat.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/gerant/menu/${id}/`);
      toast.success("Plat supprimé");
      fetchMenu();
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  const toggleDisponibilite = async (item) => {
    try {
      await api.patch(`/auth/gerant/menu/${item.id}/`, {
        disponible: !item.disponible,
        restaurant: item.restaurant,
      });
      toast.success("Disponibilité mise à jour");
      fetchMenu();
    } catch (error) {
      toast.error("Erreur changement de statut");
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      prix: "",
      restaurant: "",
      image: null,
    });
    setImagePreview(null);
    setIsEditing(false);
    setSelectedId(null);
  };

  return (
    <div className="pt-24 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">🍽️ Gérer le Menu</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-10 space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          type="text"
          name="nom"
          placeholder="Nom du plat"
          value={formData.nom}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="prix"
          placeholder="Prix (MAD)"
          value={formData.prix}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Prévisualisation"
            className="w-full h-[180px] object-cover rounded border"
          />
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            {isEditing ? "Modifier le plat" : "Ajouter le plat"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:underline"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden relative"
          >
            {item.image ? (
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `http://127.0.0.1:8000${item.image}`
                }
                alt={item.nom}
                className="w-full h-[180px] object-cover"
              />
            ) : (
              <div className="w-full h-[180px] bg-gray-100 flex items-center justify-center text-gray-400 italic">
                Aucune image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{item.nom}</h3>
              <p className="text-gray-500 text-sm mb-2">{item.description}</p>
              <p className="text-orange-600 font-bold">{item.prix} MAD</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  item.disponible ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.disponible ? "Disponible" : "Indisponible"}
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => toggleDisponibilite(item)}
                  className="text-sm text-gray-700 hover:underline"
                >
                  {item.disponible ? "Désactiver" : "Activer"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
