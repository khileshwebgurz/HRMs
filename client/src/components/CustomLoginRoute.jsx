import { useAuthStatus }  from "../components/useAuthStatus";
import Login  from "../components/Login";
import { Navigate } from "react-router-dom";

const LoginRoute = () => {
  const { loading, authenticated } = useAuthStatus();

  if (loading) return <div>Loading...</div>;

  return authenticated ? <Navigate to="/employee/dashboard" /> : <Login />;
};

export default LoginRoute;