import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";


export default function ReservationFormRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tableId = new URLSearchParams(location.search).get("table");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [etablissement, setEtablissement] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(tableId || "");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [nbAdultes, setNbAdultes] = useState(1);
  const [demande, setDemande] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");
    const paymentStatus = localStorage.getItem("paymentConfirmed");
if (paymentStatus === "ok") {
  setPaymentSuccess(false);
  localStorage.removeItem("paymentConfirmed");
}


    const headers = { headers: { Authorization: `Bearer ${token}` } };

    axios.get(`http://localhost:8000/api/auth/etablissements/${id}/`, headers)
      .then(res => setEtablissement(res.data))
      .catch(() => toast.error("Erreur lors du chargement de l'établissement."));

    axios.get(`http://localhost:8000/api/auth/etablissements/${id}/tables/`, headers)
      .then(res => setTables(res.data))
      .catch(() => toast.error("Erreur lors du chargement des tables."));

    axios.get(`http://localhost:8000/api/auth/etablissements/${id}/services/`, headers)
      .then(res => setServices(res.data))
      .catch(() => {});
  }, [id]);
  const handleStripeCheckout = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Connexion requise");
  
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
  
      // 1. Création pré-réservation
      const preRes = await axios.post(
        "http://localhost:8000/api/auth/pre-reservation/",
        {
          type_reservation: "restaurant",
          etablissement: id,
          table: selectedTable || null,
          date_debut: dateDebut,
          date_fin: dateFin,
          nb_adultes: nbAdultes,
          services: selectedServices,
          demande_speciale: demande,
        },
        headers
      );
  
      const reservationId = preRes.data.reservation_id;
  
      // 2. Démarrer paiement Stripe
      const stripeRes = await axios.post(
        "http://localhost:8000/api/auth/checkout-session/",
        { reservation_id: reservationId },
        headers
      );
  
      localStorage.setItem("paymentConfirmed", "ok");
  
      const stripe = await loadStripe(stripeRes.data.stripe_public_key);
      await stripe.redirectToCheckout({ sessionId: stripeRes.data.sessionId });
    } catch (error) {
      toast.error("Erreur lors du paiement Stripe");
    }
  };
  

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Connexion requise");

    setIsSubmitting(true);

    try {
      await axios.post(`http://localhost:8000/api/auth/reservations/`, {
        type_reservation: "restaurant",
        etablissement: id,
        table: selectedTable || null,
        date_debut: dateDebut,
        date_fin: dateFin,
        nb_adultes: nbAdultes,
        services: selectedServices,
        demande_speciale: demande,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      toast.success("Réservation envoyée !");
    } catch (err) {
      toast.error("Erreur lors de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 max-w-xl">
          <h2 className="text-3xl font-bold text-green-700">🎉 Réservation envoyée !</h2>
          <p className="text-gray-800 text-lg">
            Votre demande de réservation a bien été enregistrée. Vous recevrez une notification une fois confirmée.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Retour à l’accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">
          Réservation de Restaurant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium">Date & Heure d’arrivée</label>
              <input
                type="datetime-local"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Date & Heure de fin</label>
              <input
                type="datetime-local"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mt-4">Nombre de personnes</label>
            <input
              type="number"
              min="1"
              value={nbAdultes}
              onChange={(e) => setNbAdultes(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mt-4">Table</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Choisir une table</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.numero} - {table.capacite} personnes
                </option>
              ))}
            </select>
          </div>

          {services.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-xl mt-6">
              <h3 className="font-semibold mb-2">Services supplémentaires</h3>
              {services.map((service) => (
                <label key={service.id} className="block space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                  />
                  <span>{service.nom}</span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="block font-medium">Demande spéciale</label>
            <textarea
              value={demande}
              onChange={(e) => setDemande(e.target.value)}
              placeholder="Ex : table en terrasse, sans allergène, etc."
              className="w-full px-4 py-2 border rounded min-h-[100px]"
            />
          </div>

          <button
  type="button"
  onClick={handleStripeCheckout}
  className="w-full py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700"
>
  Payer maintenant
</button>

<button
  type="submit"
  disabled={!paymentSuccess || isSubmitting}
  className={`mt-4 w-full py-3 rounded-full font-semibold transition ${
    paymentSuccess
      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {paymentSuccess ? "Réserver maintenant" : "Paiement requis avant réservation"}
</button>

        </form>
      </div>
    </div>
  );
}
