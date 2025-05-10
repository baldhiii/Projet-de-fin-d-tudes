import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, LogOut, User, MenuSquare } from "lucide-react";

function Navbar({ theme = "light", isAuthenticated, setIsAuthenticated, userPhoto = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  // 🔄 Garde l'état d'authentification synchronisé avec le localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !isAuthenticated) {
      setIsAuthenticated(true);
    }

    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    setUserProfile(storedProfile);

    const handleProfileUpdate = () => {
      const updatedProfile = JSON.parse(localStorage.getItem("userProfile"));
      setUserProfile(updatedProfile);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [isAuthenticated, setIsAuthenticated]);

  // 📸 Détermine l'image du profil utilisateur
  const getAvatarSrc = () => {
    if (userPhoto) return userPhoto;
    if (!userProfile?.profile_picture) return null;
    if (userProfile.profile_picture.startsWith("/avatars")) return userProfile.profile_picture;
    return `http://127.0.0.1:8000/${userProfile.profile_picture.replace(/^\/?/, "")}`;
  };

  const avatarSrc = getAvatarSrc();

  // 🔓 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate("/");
  };

  // 🎨 Styles dynamiques par thème
  const themeStyles = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-white",
    cyan: "bg-cyan-100 text-gray-900",
    rose: "bg-rose-100 text-gray-900",
    black: "bg-black text-white",
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-8 py-4 flex justify-between items-center transition-all duration-300 ${currentTheme}`}
      style={{ borderBottom: "none" }}
    >
      <Link to="/" className="text-2xl font-bold text-cyan-500">
        Luxvia
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/hotels" className="hover:text-cyan-500 transition">
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
            <MenuSquare className="w-6 h-6" />
          </motion.div>
        </Link>

        {!isAuthenticated ? (
          <Link
            to="/login"
            className="text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl shadow"
          >
            Connexion
          </Link>
        ) : (
          <div className="relative">
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ rotate: 5 }}
              className="focus:outline-none rounded-full border-2 border-cyan-500 p-0.5"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profil" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <motion.div whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-100 text-cyan-700">
                  <UserCircle className="w-7 h-7" />
                </motion.div>
              )}
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2 text-sm font-bold text-cyan-600">
                    {userProfile?.first_name || "Profil"}
                  </div>
                  <button
                    onClick={() => {
                      navigate("/dashboard/client");
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon Compte
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
