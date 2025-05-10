import api from "./api";

export const getClientStats = async () => {
  const response = await api.get("/auth/dashboard/stats-client/");
  return response.data;
};

export const getActivitesRecentes = async () => {
  const response = await api.get("/auth/dashboard/activites-recentes/");
  return response.data;
};

export const getMesReservations = async () => {
    const response = await api.get("reservations/");
    return response.data;
  };
  
  export const getAvantagesClient = async () => {
    const response = await api.get("dashboard/avantages/");
    return response.data;
  };