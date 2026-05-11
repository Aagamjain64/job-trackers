import axios from "axios";

// Override with VITE_API_BASE_URL (e.g. http://localhost:5000) when your data lives on a local API.
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://job-trackers.onrender.com";

const API = axios.create({
  baseURL,
});

// Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
