// 📁 src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        {/* Colonne 1 - Luxvia et réseaux */}
        <div>
          <h2 className="text-3xl font-extrabold mb-4 text-cyan-400">Luxvia</h2>
          <p className="text-sm text-gray-300 mb-4">
            Réservez vos hôtels et restaurants avec une expérience immersive et des offres exclusives.
          </p>
          <div className="flex gap-4">
            <a
              href="https://snapchat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400"
            >
              <i className="fab fa-snapchat"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Colonne 2 - Liens rapides */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Liens rapides</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#top" className="hover:text-white">Accueil</a></li>
            <li><a href="#hotels" className="hover:text-white">Hôtels</a></li>
            <li><a href="#restaurants" className="hover:text-white">Restaurants</a></li>
            <li><Link to="/a-propos" className="hover:text-white">A propos</Link></li>
          </ul>
        </div>

        {/* Colonne 3 - Assistance */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Assistance</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
            <li><Link to="/devenir-gerant" className="hover:text-white">Nous contacter</Link></li>
            <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-white">Conditions d'utilisation</a></li>
          </ul>
        </div>

        {/* Colonne 4 - Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <i className="fas fa-map-marker-alt mr-2"></i>Meknès, Zitoune Babo
            </li>
            <li>
              <i className="fas fa-phone mr-2"></i>0774471138
            </li>
            <li>
              <i className="fas fa-envelope mr-2"></i>mo.kone@edu.umi.ac.ma
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Luxvia. Tous droits réservés.
      </div>
    </footer>
  );
}
