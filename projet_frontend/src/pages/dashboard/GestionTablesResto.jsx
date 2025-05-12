import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { motion } from "framer-motion";

export default function GestionTablesResto() {
  const { id } = useParams(); // ID du restaurant
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTable, setNewTable] = useState({
    numero: "",
    capacite: "",
    localisation: "",
    image: null,
  });

  const fetchTables = async () => {
    try {
      const res = await api.get(`/auth/tables/?restaurant=${id}`);
      setTables(res.data);
    } catch (err) {
      console.error("Erreur chargement tables :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewTable({ ...newTable, image: files[0] });
    } else {
      setNewTable({ ...newTable, [name]: value });
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("restaurant", id);
    formData.append("numero", newTable.numero);
    formData.append("capacite", newTable.capacite);
    formData.append("localisation", newTable.localisation);
    if (newTable.image) formData.append("image", newTable.image);

    try {
      await api.post("/auth/tables/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewTable({
        numero: "",
        capacite: "",
        localisation: "",
        image: null,
      });
      fetchTables();
    } catch (err) {
      console.error("Erreur ajout table :", err);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm("Supprimer cette table ?")) return;
    try {
      await api.delete(`/auth/tables/${tableId}/`);
      fetchTables();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Gérer les Tables du Restaurant #{id}</h1>

      {/* === Formulaire d’ajout === */}
      <motion.form
        onSubmit={handleAddTable}
        encType="multipart/form-data"
        className="bg-white rounded-xl p-6 shadow-md mb-10 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          name="numero"
          value={newTable.numero}
          onChange={handleInputChange}
          placeholder="Numéro de table"
          className="input"
          required
        />
        <input
          type="number"
          name="capacite"
          value={newTable.capacite}
          onChange={handleInputChange}
          placeholder="Capacité"
          className="input"
          required
        />
        <input
          type="text"
          name="localisation"
          value={newTable.localisation}
          onChange={handleInputChange}
          placeholder="Localisation (ex: terrasse)"
          className="input"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          className="input"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 col-span-1 md:col-span-3"
        >
          Ajouter la table
        </button>
      </motion.form>

      {/* === Liste des tables === */}
      {loading ? (
        <p>Chargement des tables...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <motion.div
              key={table.id}
              className="bg-white rounded shadow p-4 flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {table.image && (
                <img
                  src={table.image}
                  alt={`Table ${table.numero}`}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-bold mb-1">Table {table.numero}</h3>
              <p className="text-sm text-gray-500">Capacité : {table.capacite}</p>
              <p className="text-sm text-gray-500">Localisation : {table.localisation}</p>
              <button
                onClick={() => handleDeleteTable(table.id)}
                className="mt-4 text-red-600 text-sm hover:underline self-start"
              >
                Supprimer
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
