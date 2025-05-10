import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";



export default function EtablissementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [etablissement, setEtablissement] = useState(null);
  const [images, setImages] = useState([]);
  const [chambres, setChambres] = useState([]);
  const [tables, setTables] = useState([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
const [selectedChambreId, setSelectedChambreId] = useState(null);
const [selectedTableId, setSelectedTableId] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Veuillez vous connecter pour accéder aux détails.");
      navigate("/login");
      return;
    }
  
    const headers = { headers: { Authorization: `Bearer ${token}` } };
  
    // Étape 1 : Chargement de l’établissement
    axios
      .get(`http://localhost:8000/api/auth/etablissements/${id}/`, headers)
      .then((res) => {
        const etab = res.data;
        setEtablissement(etab);
  
        // Étape 2 : Chargement des images
        axios
          .get(`http://localhost:8000/api/auth/etablissements/${id}/images/`, headers)
          .then((res) => setImages(res.data))
          .catch(() => toast.error("Erreur lors du chargement des images"));
  
        // Étape 3 : selon le type, charger les chambres ou les tables
        if (etab.type === "hotel") {
          axios
            .get(`http://localhost:8000/api/auth/etablissements/${id}/chambres/`, headers)
            .then((res) => setChambres(res.data))
            .catch(() => toast.error("Erreur lors du chargement des chambres"));
        } else if (etab.type === "restaurant") {
          axios
            .get(`http://localhost:8000/api/auth/etablissements/${id}/tables/`, headers)
            .then((res) => setTables(res.data)) // ⚠️ tu dois avoir un state `setTables`
            .catch(() => toast.error("Erreur lors du chargement des tables"));
        }
      })
      .catch(() => toast.error("Erreur lors du chargement de l’établissement"));
  }, [id, navigate]);
  

  if (!etablissement) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Chargement en cours...
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* ✅ Nom et description */}
      <h1 className="text-4xl font-extrabold text-center text-cyan-700 mb-2">
        {etablissement.nom}
      </h1>
      <p className="text-center text-gray-600 text-lg mb-6">
        {etablissement.description}
      </p>

      {/* ✅ Image principale */}
      {etablissement.image ? (
        <div className="mb-12 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Image principale
          </h2>
          <img
            src={etablissement.image}
            alt={`Image principale de ${etablissement.nom}`}
            className="mx-auto w-full max-h-[320px] object-cover rounded-xl shadow"
          />
        </div>
      ) : (
        <p className="text-center text-gray-400 mb-12">
          Aucune image principale disponible.
        </p>
      )}

      {/* ✅ Images secondaires */}
      <div className="mb-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Autres images
        </h2>
        {images.length > 0 ? (
          <Slider {...sliderSettings}>
            {images.map((img) => (
              <div key={img.id}>
                <img
                  src={`http://localhost:8000${img.image}`}
                  alt="Autre image"
                  className="w-full h-[400px] object-cover rounded-xl shadow"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-400">
            Aucune image secondaire pour cet établissement.
          </p>
        )}
      </div>

      {/* ✅ Chambres disponibles */}
      {/* ✅ Chambres ou Tables selon le type d'établissement */}
{etablissement.type === "hotel" && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Chambres disponibles
    </h2>
    {chambres.length > 0 ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chambres.map((chambre) => (
          <div
            key={chambre.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 transition hover:shadow-xl"
          >
            {chambre.image && (
              <img
                src={`http://localhost:8000${chambre.image}`}
                alt={`Image de ${chambre.nom}`}
                className="w-full h-[180px] object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-cyan-800 mb-2">
              {chambre.nom}
            </h3>
            <p><strong>Capacité :</strong> {chambre.capacite} personne(s)</p>
            <p><strong>Prix :</strong> {chambre.prix} MAD / nuit</p>
            <p className="text-gray-600 text-sm mt-2">{chambre.description}</p>
            <button
              onClick={() => navigate(`/reserver/${etablissement.id}?chambre=${chambre.id}`)}
              className="mt-4 px-5 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
            >
              Réserver cette chambre
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center">
        Aucune chambre disponible actuellement.
      </p>
    )}
  </div>
)}

{etablissement.type === "restaurant" && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Tables disponibles
    </h2>
    {tables.length > 0 ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 transition hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold text-cyan-800 mb-2">
              Table {table.numero}
            </h3>
            <p><strong>Capacité :</strong> {table.capacite} personnes</p>
            <p className={`text-sm mt-2 ${table.disponible ? "text-green-600" : "text-red-600"}`}>
              {table.disponible ? "Disponible" : "Indisponible"}
            </p>
            <button
  onClick={() => navigate(`/etablissements/${etablissement.id}/reserver?table=${table.id}`)}
  className="mt-4 px-5 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
>
  Réserver cette table
</button>

          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center">
        Aucune table disponible actuellement.
      </p>
    )}
  </div>
)}

</div> 
  );      
}          

