import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ChambreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chambre, setChambre] = useState(null);
  const alreadyFetched = useRef(false);

  useEffect(() => {
    if (!alreadyFetched.current) {
      alreadyFetched.current = true;
      api.get(`/auth/chambres/${id}/`)
        .then((res) => {
          console.log("✅ Images reçues :", res.data.images);
          setChambre(res.data);
        })
        .catch((err) => console.error("Erreur récupération chambre :", err));
    }
  }, [id]);

  if (!chambre) return <div className="p-8 text-center text-gray-500">Chargement des détails...</div>;

  // 🔁 Supprimer les doublons d’images
  const uniqueImages = Array.from(new Map(
    chambre.images?.map(img => [img.image, img])
  ).values());

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="pt-24 max-w-6xl mx-auto px-6 pb-16">  
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">{chambre.nom}</h1>

      {/* Galerie : Slider ou Image unique */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
        {uniqueImages.length > 1 ? (
          <Slider {...sliderSettings}>
            {uniqueImages.map((img, index) => (
              <div key={`${img.id}-${index}`}>
                <img
                  src={img.image.startsWith("http") ? img.image : `http://127.0.0.1:8000${img.image}`}
                  alt={`Image ${index}`}
                  className="w-full h-[500px] object-cover"
                />
              </div>
            ))}
          </Slider>
        ) : uniqueImages.length === 1 ? (
          <img
            src={uniqueImages[0].image.startsWith("http") ? uniqueImages[0].image : `http://127.0.0.1:8000${uniqueImages[0].image}`}
            alt="Image unique"
            className="w-full h-[500px] object-cover"
          />
        ) : (
          <div className="text-center text-gray-400 py-10">Aucune image pour cette chambre.</div>
        )}
      </div>

      {/* 🧪 Bloc de test brut */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🧪 Test d’affichage direct (hors Slider)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {uniqueImages.map((img, index) => (
            <img
              key={`test-${index}`}
              src={img.image.startsWith("http") ? img.image : `http://127.0.0.1:8000${img.image}`}
              alt={`Image test ${index}`}
              className="w-full h-60 object-cover rounded-xl shadow-lg border"
            />
          ))}
        </div>
      </div>

      {/* Détails chambre */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-lg">
        <p><span className="font-semibold text-indigo-700">🛏 Description :</span> {chambre.description}</p>
        <p><span className="font-semibold text-indigo-700">👥 Capacité :</span> {chambre.capacite} personne(s)</p>
        <p><span className="font-semibold text-indigo-700">💰 Prix :</span> {chambre.prix} MAD / nuit</p>
        <p><span className="font-semibold text-indigo-700">📐 Superficie :</span> {chambre.superficie ?? "Non précisé"} m²</p>
        
      </div>

      {/* Bouton */}
      <div className="text-center mt-12">
        <button
          onClick={() => navigate(`/reserver/${chambre.hotel}?chambre=${chambre.id}`)
        }
          className="px-10 py-4 bg-indigo-600 text-white font-semibold text-lg rounded-full shadow hover:bg-indigo-700 transition duration-200"
        >
          Réserver cette chambre
        </button>
      </div>
    </div>
  );
}
