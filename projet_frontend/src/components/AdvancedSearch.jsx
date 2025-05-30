// 📁 components/SearchBarLuxvia.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchBarLuxvia() {
  const [type, setType] = useState("hotel");
  const [destination, setDestination] = useState("");
  const [etablissements, setEtablissements] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [showDestinations, setShowDestinations] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [guests, setGuests] = useState(2);
  const [chambres, setChambres] = useState(1);
  const [tables, setTables] = useState(1);
  const navigate = useNavigate();

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 4)),
    key: "selection",
  });

  const destinationRef = useRef(null);
  const calendarRef = useRef(null);
  const guestRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!destinationRef.current.contains(event.target)) setShowDestinations(false);
      if (!calendarRef.current.contains(event.target)) setShowCalendar(false);
      if (!guestRef.current.contains(event.target)) setShowGuests(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/accounts/etablissements/")
      .then((res) => setEtablissements(res.data))
      .catch((err) => console.error("Erreur chargement établissements :", err));
  }, []);

  useEffect(() => {
    const uniques = new Set(
      etablissements
        .filter((e) => e.type === type)
        .map((e) => e.destination.ville)
    );
    setDestinations([...uniques]);
  }, [type, etablissements]);

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const formattedDates = `${format(selectionRange.startDate, "d MMMM", { locale: fr })} - ${format(selectionRange.endDate, "d MMMM", { locale: fr })}`;

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="grid grid-cols-5 gap-2 items-center bg-white/80 backdrop-blur-md rounded-3xl shadow-xl px-6 py-4 max-w-5xl w-full">
        {/* Type selector */}
        <div className="col-span-5 flex justify-center mb-2">
  <div className="inline-flex rounded-full bg-gray-200 p-1 w-[280px] sm:w-[320px] md:w-[360px] justify-between">
    <button
      onClick={() => setType("hotel")}
      className={`w-1/2 py-2 rounded-full text-sm font-semibold transition ${
        type === "hotel" ? "bg-cyan-500 text-white" : "text-gray-700"
      }`}
    >
      Hôtels
    </button>
    <button
      onClick={() => setType("restaurant")}
      className={`w-1/2 py-2 rounded-full text-sm font-semibold transition ${
        type === "restaurant" ? "bg-cyan-500 text-white" : "text-gray-700"
      }`}
    >
      Restaurants
    </button>
  </div>
</div>


        {/* Destination */}
        <div ref={destinationRef} className="relative col-span-2">
          <button onClick={() => setShowDestinations((prev) => !prev)} className="flex items-center w-full px-4 py-2 bg-white rounded-xl border border-gray-300 shadow-sm hover:border-cyan-400 transition">
            <FaMapMarkerAlt className="text-cyan-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {destination || (type === "hotel" ? "Où allez-vous ?" : "Quel restaurant cherchez-vous ?")}
            </span>
          </button>

          <AnimatePresence>
            {showDestinations && (
              <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-xl p-2 border border-gray-200 max-h-64 overflow-y-auto">
                {destinations.map((ville) => (
                  <li key={ville} className="px-3 py-2 text-gray-800 hover:bg-cyan-100 rounded-md font-medium cursor-pointer transition" onClick={() => {
                    setDestination(ville);
                    setShowDestinations(false);
                  }}>
                    {ville}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Calendar */}
        <div ref={calendarRef} className="relative col-span-2">
          <button onClick={() => setShowCalendar((prev) => !prev)} className="flex items-center w-full px-4 py-2 bg-white rounded-xl border border-gray-300 shadow-sm hover:border-cyan-400 transition">
            <FaCalendarAlt className="text-cyan-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">{formattedDates}</span>
          </button>

          <AnimatePresence>
            {showCalendar && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute z-10 mt-2 bg-white rounded-xl shadow-lg p-3 overflow-hidden" style={{ height: "280px", maxHeight: "280px" }}>
                <div className="transform scale-90 origin-top-left">
                  <DateRange ranges={[selectionRange]} onChange={handleSelect} locale={fr} showDateDisplay={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guests */}
        <div ref={guestRef} className="relative col-span-1">
          <button onClick={() => setShowGuests((prev) => !prev)} className="flex items-center w-full px-4 py-2 bg-white rounded-xl border border-gray-300 shadow-sm hover:border-cyan-400 transition">
            <FaUserFriends className="text-cyan-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {type === "hotel"
                ? `${guests} personnes, ${chambres} chambre${chambres > 1 ? "s" : ""}`
                : `${guests} personnes, ${tables} table${tables > 1 ? "s" : ""}`}
            </span>
          </button>

          <AnimatePresence>
            {showGuests && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute z-10 mt-2 bg-white rounded-xl shadow-lg p-4 space-y-4">
                <div>
                  <span className="block mb-1 text-sm font-semibold text-gray-600">Personnes</span>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="bg-gray-200 px-3 rounded-full text-lg">−</button>
                    <span className="font-semibold">{guests}</span>
                    <button onClick={() => setGuests((g) => g + 1)} className="bg-gray-200 px-3 rounded-full text-lg">+</button>
                  </div>
                </div>
                <div>
                  <span className="block mb-1 text-sm font-semibold text-gray-600">
                    {type === "hotel" ? "Chambres" : "Tables"}
                  </span>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => type === "hotel" ? setChambres((c) => Math.max(1, c - 1)) : setTables((t) => Math.max(1, t - 1))} className="bg-gray-200 px-3 rounded-full text-lg">−</button>
                    <span className="font-semibold">
                      {type === "hotel" ? chambres : tables}
                    </span>
                    <button onClick={() => type === "hotel" ? setChambres((c) => c + 1) : setTables((t) => t + 1)} className="bg-gray-200 px-3 rounded-full text-lg">+</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="col-span-5 text-center mt-2">
          <button
            onClick={() =>
              navigate(
                `/recherche-resultats?ville=${encodeURIComponent(destination)}&type=${type}&date_debut=${selectionRange.startDate.toISOString().split("T")[0]}&date_fin=${selectionRange.endDate.toISOString().split("T")[0]}`
              )
            }
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-8 py-2 rounded-full hover:opacity-90 transition"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}
