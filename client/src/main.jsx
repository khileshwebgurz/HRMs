// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserContext } from "./context/UserContext.jsx";
import useAuthStatus from "./components/Auth/useAuthStatus.jsx";
import { Navigate } from "react-router-dom";

const RootWrapper = () => {
  const { loading, authenticated, user } = useAuthStatus();

  if (loading) return <div>Loading...</div>;

  if (!authenticated) return  <Navigate to="/login" />;

  return (
    <UserContext.Provider value={user}>
      <App />
    </UserContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(<RootWrapper />);