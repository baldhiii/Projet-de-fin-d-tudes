// src/pages/MonCompte.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { uploadProfilePicture } from "../services/uploadService";
import api from "../services/api"; // <- C'était oublié chez toi ici
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";



const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
  "/avatars/avatar10.png",
];

function MonCompte() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_picture: "",
  });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Charger le profil depuis API ou localStorage
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setProfile({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          profile_picture: data.profile_picture,
        });
        localStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    }

    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      fetchProfile();
    }
  }, []);

  const updateLocalStorageProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    window.dispatchEvent(new Event("profileUpdated")); // 🔥 custom event pour la Navbar
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = async (avatarPath) => {
    try {
      await api.patch("/auth/profile/", { profile_picture: avatarPath });
      const updatedProfile = { ...profile, profile_picture: avatarPath };
      updateLocalStorageProfile(updatedProfile);
      toast.success("Avatar mis à jour !");
    } catch (error) {
      console.error("Erreur avatar :", error);
      toast.error("Erreur lors de la mise à jour de l'avatar.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      });
      updateLocalStorageProfile(profile);
      toast.success("Profil mis à jour !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du profil.");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { old_password, new_password, new_password2 } = passwordData;
      if (new_password !== new_password2) {
        toast.error("Les mots de passe ne correspondent pas.");
        setLoading(false);
        return;
      }
      await api.post("/auth/password/change/", { old_password, new_password });
      toast.success("Mot de passe changé !");
      setPasswordData({ old_password: "", new_password: "", new_password2: "" });
      setShowPasswordSection(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du changement du mot de passe.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/60 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-4xl"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Mon Profil</h1>

        {/* Avatar actuel */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture.startsWith("/avatars") ? profile.profile_picture : `http://127.0.0.1:8000${profile.profile_picture}`}
                alt="Profil"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-2xl">?</div>
            )}
          </div>
        </div>

        {/* Choix d'avatars */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {avatars.map((avatar) => (
            <div
              key={avatar}
              className={`w-20 h-20 rounded-full overflow-hidden cursor-pointer border-4 ${
                profile.profile_picture === avatar ? "border-blue-500" : "border-transparent"
              } hover:scale-105 transition`}
              onClick={() => handleAvatarSelect(avatar)}
            >
              <img src={avatar} alt="avatar" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>

        {/* Formulaire de modification */}
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-8">
          <input
            type="text"
            name="first_name"
            value={profile.first_name}
            onChange={handleChange}
            placeholder="Prénom"
            className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="last_name"
            value={profile.last_name}
            onChange={handleChange}
            placeholder="Nom"
            className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition"
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>

        {/* Toggle section mot de passe */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="text-blue-600 hover:underline font-semibold"
          >
            {showPasswordSection ? "Annuler le changement de mot de passe" : "Changer le mot de passe"}
          </button>
        </div>

        {/* Formulaire changement mot de passe */}
        <AnimatePresence>
          {showPasswordSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleChangePassword} className="space-y-4 mb-6">
                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  placeholder="Ancien mot de passe"
                  className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Nouveau mot de passe"
                  className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <input
                  type="password"
                  name="new_password2"
                  value={passwordData.new_password2}
                  onChange={handlePasswordChange}
                  placeholder="Confirmer nouveau mot de passe"
                  className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold transition"
                >
                  {loading ? "Changement..." : "Valider le changement"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default MonCompte;
