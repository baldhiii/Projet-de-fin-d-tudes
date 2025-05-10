// src/components/SearchBar.jsx
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const phrases = [
  "Réservez votre hôtel de rêve...",
  "Trouvez le meilleur restaurant...",
  "Découvrez les meilleurs spas...",
  "Planifiez votre séjour au Maroc...",
  "Explorez les cafés les plus tendances...",
  "Détendez-vous dans un hôtel de luxe...",
];

export default function SearchBar() {
  const [placeholder, setPlaceholder] = useState("");
  const [fullText, setFullText] = useState(phrases[0]);
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [userTyping, setUserTyping] = useState(false);

  useEffect(() => {
    if (userTyping) return; // ❌ Arrête l'animation si utilisateur écrit

    const typingSpeed = isDeleting ? 50 : 100;
    const pauseDuration = 1500;

    const handleTyping = () => {
      if (!isDeleting && placeholder.length < fullText.length) {
        setPlaceholder(fullText.substring(0, placeholder.length + 1));
      } else if (isDeleting && placeholder.length > 0) {
        setPlaceholder(fullText.substring(0, placeholder.length - 1));
      } else if (!isDeleting && placeholder.length === fullText.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && placeholder.length === 0) {
        const nextPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setFullText(nextPhrase);
        setIsDeleting(false);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, fullText, userTyping]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setUserTyping(e.target.value.length > 0);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-4xl">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-5 py-4 pl-14 rounded-full shadow-lg backdrop-blur-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-lg"
        />
        <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
      </div>
    </div>
  );
}

