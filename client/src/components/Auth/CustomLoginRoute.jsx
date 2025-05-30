import useAuthStatus   from "../Auth/useAuthStatus";
import Login  from "./Login";
import { Navigate } from "react-router-dom";

const LoginRoute = () => {
  const { loading, authenticated } = useAuthStatus();

  if (loading) return <div></div>;

  return authenticated ? <Navigate to="/employee/dashboard" /> : <Login />;
};

export default LoginRoute;