import React from "react";
import { useUser } from "../context/UserContext";
import "../assets/css/dashboard.css";
import '../../public/css/admin-panel.css'
import { useOutletContext } from "react-router-dom";
import EmployeeDashboard from "./DashboardComponent/DiffDashboard/EmployeeDashboard";
import AdminDashboard from "./DashboardComponent/DiffDashboard/AdminDashboard";
const Dashboard = () => {
  const user = useUser();

  if (!user) return null;
  const { isAdminMode } = useOutletContext();

  if (user.user_role === '1'  || user.user_role === '7' || user.user_role === '5') {
    return isAdminMode ? <AdminDashboard /> : <EmployeeDashboard user={user} />;
  }

  if (user.user_role === '2' || user.user_role === '3') {
    return <EmployeeDashboard user={user} />;
  }

  return <div>Unauthorized</div>;
};

export default Dashboard;
