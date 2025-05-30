import React  from 'react';
import useAuthStatus from './useAuthStatus';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
const ProtectedRoute = ({ children }) => {
  const { loading, authenticated, user } = useAuthStatus();

  if (loading) return <div></div>;

  if (!authenticated) return <Navigate to="/login" />;

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default ProtectedRoute;
