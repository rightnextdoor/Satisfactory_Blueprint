// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // use relative path so Vite proxy kicks in
  headers: { 'Content-Type': 'application/json' },
});

export default api;
