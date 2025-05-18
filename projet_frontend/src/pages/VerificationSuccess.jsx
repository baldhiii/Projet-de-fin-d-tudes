// 📁 src/pages/VerificationEmail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function VerificationEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const navigate = useNavigate();

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setStatus("error");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/auth/users/activation/", { uid, token })
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch(() => {
        setStatus("error");
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center"
      >
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin mx-auto text-blue-600" size={50} />
            <p className="mt-6 text-lg text-gray-700">Vérification en cours...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="text-green-600 mx-auto" size={60} />
            <h1 className="text-2xl font-bold text-gray-800 mt-6">
              🎉 Email vérifié avec succès !
            </h1>
            <p className="text-gray-600 mt-2">Redirection vers la connexion...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="text-red-600 mx-auto" size={60} />
            <h1 className="text-2xl font-bold text-gray-800 mt-6">❌ Erreur de vérification</h1>
            <p className="text-gray-600 mt-2">Lien invalide ou déjà utilisé.</p>
            <button
              onClick={() => navigate("/register")}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Recommencer l’inscription
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

