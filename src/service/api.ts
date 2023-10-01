import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE.API_URL,
  timeout: 5000,
});

export default api;
