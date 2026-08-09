import axios from "axios";

// Base URL for the Express/Prisma backend. Override with a .env file:
// VITE_API_URL=https://your-deployed-api.com/api/v1
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

// Attach the stored JWT (if any) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("stockroom_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
