import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterGerant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    matricule: "",
    date_embauche: "",
    type_gerant: "hotel",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:8000/api/auth/register-gerant/", form);
      navigate("/login-gerant");
    } catch (err) {
      setError("Erreur d'inscription. Vérifiez les champs.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-800">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl flex overflow-hidden">
        {/* Left: Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/2 p-10"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">INSCRIPTION GÉRANT HÔTEL</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" placeholder="Email" required className="input" onChange={handleChange} />
            <input name="username" placeholder="Nom d'utilisateur" required className="input" onChange={handleChange} />
            <input name="first_name" placeholder="Prénom" required className="input" onChange={handleChange} />
            <input name="last_name" placeholder="Nom" required className="input" onChange={handleChange} />
            <input name="matricule" placeholder="Matricule" required className="input" onChange={handleChange} />
            <input name="date_embauche" type="date" required className="input" onChange={handleChange} />
            <input name="password" type="password" placeholder="Mot de passe" required className="input" onChange={handleChange} />
            <input name="password2" type="password" placeholder="Confirmer le mot de passe" required className="input" onChange={handleChange} />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-md hover:opacity-90 transition"
            >
              S’INSCRIRE
            </button>
          </form>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/2 bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-10 flex flex-col justify-center items-center"
        >
          <h1 className="text-3xl font-bold mb-4">Bienvenue sur Luxvia</h1>
          <p className="text-center text-sm max-w-sm mb-6">
            Créez un compte pour gérer vos hôtels, vos réservations et vos services.
          </p>
          <button
            onClick={() => navigate("/login-gerant")}
            className="px-6 py-2 bg-white text-indigo-800 font-semibold rounded-full hover:bg-gray-200 transition"
          >
            Déjà inscrit ? Connectez-vous
          </button>
        </motion.div>
      </div>
    </div>
  );
}
