/// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/userService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const data = await getUserProfile();
      setUser(data);
    } catch (error) {
      console.error("Erreur chargement utilisateur :", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, reloadUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}