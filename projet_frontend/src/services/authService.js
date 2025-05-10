import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/auth/";

export const registerUser = async (formData) => {
  const response = await axios.post(`${API_URL}register/`, formData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}login/`, credentials);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

