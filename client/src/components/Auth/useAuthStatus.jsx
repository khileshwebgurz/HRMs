// // hooks/useAuthStatus.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/employee/user`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  return { loading, authenticated, user };
};

export default useAuthStatus