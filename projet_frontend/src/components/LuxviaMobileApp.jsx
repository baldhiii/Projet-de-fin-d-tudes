import { motion } from "framer-motion";

export default function LuxviaMobileApp() {
  return (
    <section className="w-full bg-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            📱 Luxvia arrive sur mobile
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Réservez vos hôtels et restaurants préférés en quelques clics,
            directement depuis votre smartphone. Disponible bientôt sur iOS
            et Android.
          </p>
          <div className="flex gap-4">
            {/* App Store */}
            <a
              href="#"
              className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              <img
                src="/images/64px-App_Store_(iOS).svg.png"
                alt="App Store"
                className="w-6 h-6"
              />
              <div className="text-left">
                <p className="text-xs">Télécharger sur</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="#"
              className="flex items-center gap-3 bg-white border border-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <img
                src="/images/googleplay.svg"
                alt="Google Play"
                className="w-6 h-6"
              />
              <div className="text-left">
                <p className="text-xs">Disponible sur</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <img
            src="/images/luxvia-app-mockup.png"
            alt="Aperçu application Luxvia"
            className="w-64 h-auto rounded-xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
