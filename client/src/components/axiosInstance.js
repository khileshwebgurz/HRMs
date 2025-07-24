import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Send cookies automatically
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const redirectUrl = error.response.data.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
