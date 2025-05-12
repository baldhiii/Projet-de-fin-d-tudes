import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Marquer le paiement comme confirmé
    localStorage.setItem("paymentConfirmed", "ok");

    // Redirection automatique après 3 secondes
    const timeout = setTimeout(() => {
      navigate("/dashboard/client"); // Ou remplace par /dashboard/client si tu préfères
    }, 3000);

    return () => clearTimeout(timeout); // Nettoyer si composant démonté
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold text-green-700">✅ Paiement réussi</h1>
        <p className="text-gray-600">
          Votre paiement a bien été confirmé. Vous allez être redirigé automatiquement...
        </p>
      </div>
    </div>
  );
}


