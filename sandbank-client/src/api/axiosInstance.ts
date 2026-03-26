import axios from "axios";

// Create axios instance pointing to API
const axiosInstance = axios.create({
  baseURL: "https://localhost:5156/api",
});

// Interceptor (runs before every request)
axiosInstance.interceptors.request.use((config) => {
  // Grab token from localStorage
  const token = localStorage.getItem("token");

  // If token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // send request
});

export default axiosInstance;
