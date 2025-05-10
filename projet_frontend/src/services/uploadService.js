// src/services/uploadService.js
// src/services/uploadService.js

import api from "./api";

export async function uploadProfilePicture(file, profile) {
  const formData = new FormData();
  formData.append("profile_picture", file);
  formData.append("email", profile.email);
  formData.append("first_name", profile.first_name);
  formData.append("last_name", profile.last_name);

  const token = localStorage.getItem('accessToken');

  try {
    const response = await api.patch(
      "/auth/profile/",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo :", error.response || error);
    throw error;
  }
}

