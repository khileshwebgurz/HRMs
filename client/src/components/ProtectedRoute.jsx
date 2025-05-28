import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { UserContext } from '../context/UserContext';
import {useAuthStatus} from '../components/useAuthStatus'
const ProtectedRoute = ({ children }) => {
  const { loading, authenticated, user } = useAuthStatus();

  if (loading) return <div>Loading authentication...</div>;

  if (!authenticated) return <Navigate to="/login" />;

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default ProtectedRoute;
