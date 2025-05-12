import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function ModifierReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [nbAdultes, setNbAdultes] = useState(1);
  const [nbEnfants, setNbEnfants] = useState(0);
  const [demande, setDemande] = useState("");

  useEffect(() => {
    api.get(`dashboard/reservations/${id}/`)
      .then(res => {
        setReservation(res.data);
        setDateDebut(res.data.date_debut);
        setDateFin(res.data.date_fin);
        setNbAdultes(res.data.nb_adultes);
        setNbEnfants(res.data.nb_enfants);
        setDemande(res.data.demande_speciale || "");
      })
      .catch(() => toast.error("Erreur chargement réservation"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`dashboard/reservations/${id}/`, {
        date_debut: dateDebut,
        date_fin: dateFin,
        nb_adultes: nbAdultes,
        nb_enfants: nbEnfants,
        demande_speciale: demande,
      });
      toast.success("Réservation modifiée avec succès !");
      navigate("/dashboard/client");
    } catch (err) {
      toast.error("Erreur lors de la modification.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  if (!reservation || reservation.statut !== "en_attente") {
    return <div className="text-center mt-10 text-red-600">Impossible de modifier cette réservation.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold text-center text-yellow-600 mb-6">
        Modifier Réservation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Date d’arrivée</label>
          <input
            type="datetime-local"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Date de départ</label>
          <input
            type="datetime-local"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Nombre d’adultes</label>
          <input
            type="number"
            min="1"
            value={nbAdultes}
            onChange={(e) => setNbAdultes(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Nombre d’enfants</label>
          <input
            type="number"
            min="0"
            value={nbEnfants}
            onChange={(e) => setNbEnfants(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Demande spéciale</label>
          <textarea
            value={demande}
            onChange={(e) => setDemande(e.target.value)}
            className="w-full border px-4 py-2 rounded min-h-[100px]"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
