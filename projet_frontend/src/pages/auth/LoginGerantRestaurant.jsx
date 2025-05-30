import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginGerantRestaurant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login/", form);
      const token = res.data.access;
      localStorage.setItem("accessToken", token);

      navigate("/dashboard/restaurant"); // ✅ redirection sans vérif, comme pour hôtels
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-600 to-red-700">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl flex overflow-hidden">
        {/* Login Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/2 p-10"
        >
          <h2 className="text-2xl font-bold text-red-700 mb-8">CONNEXION GÉRANT RESTAURANT</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Adresse e-mail"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-md font-semibold hover:opacity-90 transition">
              SE CONNECTER
            </button>
          </form>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/2 bg-gradient-to-br from-red-800 to-rose-900 text-white p-10 flex flex-col justify-center items-center"
        >
          <h1 className="text-3xl font-bold mb-4">Bienvenue sur Luxvia</h1>
          <p className="text-center text-sm max-w-sm mb-6">
            Connectez-vous pour gérer vos restaurants et vos réservations.
          </p>
          <button
            onClick={() => navigate("/register-gerant-restaurant")}
            className="px-6 py-2 bg-white text-red-700 font-semibold rounded-full hover:bg-gray-200 transition"
          >
            Pas encore inscrit ? Créez un compte
          </button>
        </motion.div>
      </div>
    </div>
  );
}
