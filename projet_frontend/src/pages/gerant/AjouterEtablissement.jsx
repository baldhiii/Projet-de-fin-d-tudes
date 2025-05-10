import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHotel, FaMapMarkerAlt, FaPhoneAlt, FaImage, FaAlignLeft, FaCity
} from "react-icons/fa";
import api from "../../services/api";

function AjouterEtablissement() {
  const [formData, setFormData] = useState({
    nom: "", description: "", ville: "", adresse: "", telephone: "", image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const villesMaroc = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
    "Meknès", "Oujda", "Tétouan", "El Jadida", "Safi", "Nador",
    "Khouribga", "Béni Mellal", "Laâyoune", "Dakhla"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));

    try {
      await api.post("accounts/etablissements/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Établissement ajouté avec succès !");
      setFormData({ nom: "", description: "", ville: "", adresse: "", telephone: "", image: null });
      setPreviewImage(null);
    } catch (err) {
      alert("❌ Une erreur est survenue. Vérifiez les champs ou le token.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecf3ff] to-white flex items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl px-10 py-12"
      >
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10 flex items-center justify-center gap-2">
          <FaHotel /> Ajouter un établissement
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={<FaHotel />} label="Nom" name="nom" value={formData.nom} onChange={handleChange} />

          {/* Combo input + select pour ville */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FaCity /> Ville
            </label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              placeholder="Tapez ou sélectionnez"
              className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-300 outline-none mb-2"
            />
            <select
              onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
            >
              <option value="">-- Sélectionner une ville --</option>
              {villesMaroc.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>

          <InputField icon={<FaMapMarkerAlt />} label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} full />
          <InputField icon={<FaPhoneAlt />} label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} />

          {/* Photo avec preview + bouton */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FaImage /> Photo de l’établissement
            </label>
            <div className="w-full border-2 border-dashed border-indigo-300 bg-white/60 rounded-xl p-6 text-center shadow-inner">
              {previewImage ? (
                <img src={previewImage} alt="Prévisualisation" className="mx-auto max-h-48 rounded-lg shadow-md" />
              ) : (
                <p className="text-gray-500">Aucune image sélectionnée</p>
              )}
              <label className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-indigo-700 transition">
                Ajouter une photo
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <TextareaField icon={<FaAlignLeft />} label="Description" name="description" value={formData.description} onChange={handleChange} full />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-10 w-full bg-indigo-600 text-white text-lg font-semibold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          Enregistrer l’établissement
        </motion.button>
      </motion.form>
    </div>
  );
}

function InputField({ icon, label, name, value, onChange, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">{icon} {label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-300 outline-none"
        placeholder={`Saisir ${label.toLowerCase()}`}
        required
      />
    </div>
  );
}

function TextareaField({ icon, label, name, value, onChange, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">{icon} {label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 shadow-inner focus:ring-2 focus:ring-indigo-300 outline-none"
        placeholder={`Décrivez ${label.toLowerCase()}`}
      />
    </div>
  );
}

export default AjouterEtablissement;


