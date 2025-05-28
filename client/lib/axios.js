// axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // or your Laravel API URL
  withCredentials: true, // 👈 REQUIRED to send cookies
});

export default api;
