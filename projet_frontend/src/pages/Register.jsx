import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Toast from "../components/Toast";


function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    re_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/auth/users/", formData);
      setSuccessMessage("🎉 Votre compte a été créé avec succès !");
      setErrorMessage("");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      const messages = error.response?.data || {};
      let formatted = "";
      for (const field in messages) {
        formatted += `• ${field} : ${messages[field]}\n`;
      }
      setErrorMessage(formatted || "Une erreur inconnue est survenue.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          📝 Créer un compte
        </h2>

        {/* Alertes */}
        <AnimatePresence>
       {successMessage && (
      <Toast
      message={successMessage}
      onClose={() => {
        setSuccessMessage("");
        navigate("/login");
      }}
    />
       )}

  {errorMessage && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-4 w-full bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl shadow-md whitespace-pre-line"
    >
      ❌ Erreurs :
      <br />
      {errorMessage}
    </motion.div>
       )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nom d'utilisateur */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="username"
              required
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              className="peer block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="username" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Nom d'utilisateur
            </label>
          </div>

          {/* Email */}
          <div className="relative z-0 w-full group">
            <input
              type="email"
              name="email"
              required
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              className="peer block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Adresse email
            </label>
          </div>

          {/* Prénom */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="first_name"
              required
              placeholder=" "
              value={formData.first_name}
              onChange={handleChange}
              className="peer block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="first_name" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Prénom
            </label>
          </div>

          {/* Nom */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="last_name"
              required
              placeholder=" "
              value={formData.last_name}
              onChange={handleChange}
              className="peer block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="last_name" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Nom
            </label>
          </div>

          {/* Mot de passe */}
          <div className="relative z-0 w-full group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              className="peer block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Mot de passe
            </label>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div className="relative z-0 w-full group">
            <input
              type={showRePassword ? "text" : "password"}
              name="re_password"
              required
              placeholder=" "
              value={formData.re_password}
              onChange={handleChange}
              className="peer block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="re_password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Confirmer mot de passe
            </label>
            <div
              onClick={() => setShowRePassword(!showRePassword)}
              className="absolute right-4 top-3 text-gray-600 cursor-pointer"
            >
              {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Bouton s'inscrire */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            S'inscrire
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
