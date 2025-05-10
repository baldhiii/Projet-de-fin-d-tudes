// src/services/userService.js
import api from "./api"; // On garde bien sûr

// Récupérer les informations du profil utilisateur
export async function getUserProfile() {
  try {
    const response = await api.get("/auth/profile/");  // 🛠️ corrigé ici
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement du profil utilisateur :", error);
    throw error;
  }
}

// Mettre à jour les informations du profil utilisateur
export async function updateUserProfile(data) {
    try {
      const response = await api.put("/auth/profile/", data);  // 🔥 PAS /update/
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil utilisateur :", error);
      throw error;
    }
  }
  
  