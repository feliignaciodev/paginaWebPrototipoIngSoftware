import axios from 'axios';

const STORAGE_KEY = 'pooltech_session';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const token = raw ? JSON.parse(raw).token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // sesión corrupta — continuar sin token
  }
  return config;
});

export default api;
