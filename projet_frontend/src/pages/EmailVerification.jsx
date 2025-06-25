import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">📬 Vérification de votre adresse email</h1>
        <p className="text-gray-600 mb-6">
          Un email de confirmation vous a été envoyé. Cliquez sur le lien pour activer votre compte.
        </p>
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          📧 Aller sur Gmail
        </a>
      </div>
    </div>
  );
}
