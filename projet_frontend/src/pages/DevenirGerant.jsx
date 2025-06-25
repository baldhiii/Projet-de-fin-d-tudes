import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import api from "../services/api";
import Footer from "../components/Footer";

export default function DevenirGerant() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    type_gerant: "hotel",
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/accounts/demande-gerant/", formData);
      setSuccess(true);
      setFormData({ nom: "", prenom: "", email: "", telephone: "", type_gerant: "hotel", message: "" });
    } catch (error) {
      alert("Erreur lors de l'envoi du formulaire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar
  isAuthenticated={false}
  setIsAuthenticated={() => {}}
  userPhoto={null}
/>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-6 py-20"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-600">
          🔑 Devenir Gérant sur Luxvia
        </h1>

        {success ? (
          <div className="bg-green-100 text-green-700 p-4 rounded">
            Votre demande a bien été envoyée. Nous vous contacterons rapidement.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom"
                className="border px-4 py-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Prénom"
                className="border px-4 py-2 rounded w-full"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Adresse e-mail"
              className="border px-4 py-2 rounded w-full"
              required
            />
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Téléphone"
              className="border px-4 py-2 rounded w-full"
              required
            />
            <select
              name="type_gerant"
              value={formData.type_gerant}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              required
            >
              <option value="hotel">Gérant d'hôtel</option>
              <option value="restaurant">Gérant de restaurant</option>
            </select>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez votre établissement ou motivation"
              rows="5"
              className="border px-4 py-2 rounded w-full"
              required
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 text-white px-6 py-3 rounded hover:bg-cyan-700 transition"
            >
              {loading ? "Envoi..." : "Envoyer ma demande"}
            </button>
          </form>
        )}
      </motion.div>
      <Footer />
    </div>
  );
}

