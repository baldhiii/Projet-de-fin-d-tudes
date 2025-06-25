

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', credentials);
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('❌ Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
          🔐 Connexion
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative z-0 w-full group">
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder=" "
              className="block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-3.5 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Adresse email
            </label>
          </div>

          
          <div className="relative z-0 w-full group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder=" "
              className="block px-4 pt-5 pb-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-3.5 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-600">
              Mot de passe
            </label>
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
          </div>

          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-600 text-center font-medium"
            >
              {error}
            </motion.p>
          )}

         
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Se connecter
          </motion.button>
        </form>

        <div className="my-6 border-t border-gray-300 text-center relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 text-gray-400 text-sm">
            ou
          </span>
        </div>

        <div className="flex flex-col space-y-4">
          <button className="w-full border border-gray-300 py-2 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-100 transition">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            <span className="text-sm font-medium text-gray-700">
              Se connecter avec Google
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore inscrit ?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

