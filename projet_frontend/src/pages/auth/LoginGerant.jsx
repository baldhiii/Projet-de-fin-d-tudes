import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginGerant() {
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
      localStorage.setItem("accessToken", res.data.access);
      navigate("/gerant/dashboard");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-800">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl flex overflow-hidden">
        {/* Login Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/2 p-10"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-8">SIGN IN</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md font-semibold hover:opacity-90 transition">
              ALLEZ ON Y VAS
            </button>
            <p className="text-sm text-right text-gray-500 cursor-pointer hover:underline">
              Mot de passe oublié ?
            </p>
          </form>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/2 bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-10 flex flex-col justify-center items-center"
        >
          <h1 className="text-3xl font-bold mb-4">Heureux de vous revoir!</h1>
          <p className="text-center text-sm max-w-sm mb-6">
            Accédez à votre tableau de bord pour gérer vos réservations, hôtels ou restaurants.
          </p>
          <button
            onClick={() => navigate("/register-gerant")}
            className="px-6 py-2 bg-white text-indigo-800 font-semibold rounded-full hover:bg-gray-200 transition"
          >
            INSCRIVEZ-VOUS
          </button>
        </motion.div>
      </div>
    </div>
  );
}
