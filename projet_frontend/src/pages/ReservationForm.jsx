import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

export default function ReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chambreId = new URLSearchParams(location.search).get("chambre");

  const [etablissement, setEtablissement] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(chambreId || "");
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [profile, setProfile] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: ""  // laissé vide volontairement
  });
  
  const [demande, setDemande] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);



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
      .catch(() => toast.error("Erreur chargement établissement"));

    axios.get(`http://localhost:8000/api/auth/etablissements/${id}/chambres/`, headers)
      .then(res => setRooms(res.data))
      .catch(() => toast.error("Erreur chargement chambres"));

    axios.get(`http://localhost:8000/api/auth/etablissements/${id}/services/`, headers)
      .then(res => setServices(res.data))
      .catch(() => {});

      axios.get("http://localhost:8000/api/auth/profile/", headers)
      .then(res => {
        const { first_name, last_name, email } = res.data;
        setProfile(prev => ({
          ...prev,
          prenom: first_name || "",
          nom: last_name || "",
          email: email || ""
        }));
      })
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
          type_reservation: "hotel",
          etablissement: id,
          chambre: selectedRoom || null,
          date_debut: dateDebut,
          date_fin: dateFin,
          nb_adultes: adults,
          nb_enfants: children,
          services: selectedServices,
          demande_speciale: demande,
        },
        headers
      );
  
      const reservationId = preRes.data.reservation_id;
  
      // 2. Demande d'une session Stripe
      const stripeRes = await axios.post(
        "http://localhost:8000/api/auth/checkout-session/",
        { reservation_id: reservationId },
        headers
      );
  
      // 3. Avant de rediriger, on enregistre un flag dans le localStorage
      localStorage.setItem("paymentConfirmed", "ok");
  
      // 4. Redirection vers Stripe
      const stripe = await loadStripe(stripeRes.data.stripe_public_key);
      await stripe.redirectToCheckout({ sessionId: stripeRes.data.sessionId });
  
    } catch (error) {
      toast.error("Erreur lors du paiement Stripe");
    }
  };
  
  
  
  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Connexion requise");
  
    setIsSubmitting(true);  // loader actif
  
    try {
      await axios.post(`http://localhost:8000/api/auth/reservations/`, {
        type_reservation: "hotel",
        etablissement: id,
        chambre: selectedRoom || null,
        date_debut: dateDebut,
        date_fin: dateFin,
        nb_adultes: adults,
        nb_enfants: children,
        services: selectedServices,
        demande_speciale: demande
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setSuccess(true);  // succès activé
      toast.success("Réservation envoyée !");
    } catch (err) {
      toast.error("Erreur lors de la réservation");
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
            Votre demande de réservation a bien été enregistrée. Une fois qu’elle sera
            <span className="font-semibold text-green-700"> acceptée par l’établissement</span>, 
            vous ne pourrez plus la modifier.
          </p>
          <p className="text-gray-600">
            Vous recevrez une notification lorsque votre réservation sera confirmée.
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
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">
          Réservation d'Hôtel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
        
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div>
      <label className="block mb-2 font-medium">Date d'arrivée</label>
      <input
        type="datetime-local"
        value={dateDebut}
        onChange={(e) => {
          const newDate = e.target.value;
          setDateDebut(newDate);

          // Réinitialiser la date de fin si elle devient invalide
          if (dateFin && new Date(newDate) > new Date(dateFin)) {
            setDateFin("");
          }
        }}
        required
        className="w-full px-4 py-2 border rounded"
      />
    </div>

    <div>
      <label className="block mb-2 font-medium">Date de départ</label>
      <input
        type="datetime-local"
        value={dateFin}
        onChange={(e) => setDateFin(e.target.value)}
        min={dateDebut} // Empêche de sélectionner une date antérieure
        required
        className="w-full px-4 py-2 border rounded"
      />
    </div>
  

  {/* Message d’erreur optionnel (UX) */}
  {dateDebut && dateFin && new Date(dateFin) < new Date(dateDebut) && (
    <p className="text-red-600 text-sm mt-2">
      ⚠️ La date de départ ne peut pas être avant la date d’arrivée.
    </p>
  )}

            <div>
              <label className="block mb-2 font-medium">Adultes</label>
              <input type="number" min="1" value={adults} onChange={(e) => setAdults(e.target.value)} className="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label className="block mb-2 font-medium">Enfants</label>
              <input type="number" min="0" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full px-4 py-2 border rounded" />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-2 font-medium">Type de chambre</label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full px-4 py-2 border rounded">
                <option value="">Sélectionner un type de chambre</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {services.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Options supplémentaires</h3>
              {services.map(service => (
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

<div className="space-y-4">
  <h3 className="text-xl font-semibold">Informations personnelles</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input
      type="text"
      value={profile.prenom}
      onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
      placeholder="Prénom"
      className="px-4 py-2 border rounded"
    />
    <input
      type="text"
      value={profile.nom}
      onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
      placeholder="Nom"
      className="px-4 py-2 border rounded"
    />
    <input
      type="email"
      value={profile.email}
      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      placeholder="Email"
      className="px-4 py-2 border rounded"
    />
    <input
      type="tel"
      value={profile.telephone}
      onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
      placeholder="Téléphone"
      className="px-4 py-2 border rounded"
    />
  </div>

  <textarea
    placeholder="Demande spéciale..."
    value={demande}
    onChange={(e) => setDemande(e.target.value)}
    className="w-full border px-4 py-2 rounded min-h-[100px]"
  ></textarea>
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
  disabled={!paymentSuccess}
  className={`mt-6 w-full py-3 rounded-full font-semibold transition ${
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
