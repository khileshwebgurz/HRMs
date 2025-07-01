import React from "react";
import { useUser } from "../context/UserContext";
import "../assets/css/dashboard.css";
// import '../../public/css/admin-panel.css'
import EmployeeDashboard from "../DashboardComponent/DiffDashboard/EmployeeDashboard";
import AdminDashboard from "../DashboardComponent/DiffDashboard/AdminDashboard";
const Dashboard = () => {
  const user = useUser();
  console.log("my user >>", user);
  if (!user) return null;

  if (user.user_role === '1' || user.user_role === '3' || user.user_role === '7') {
    return <AdminDashboard />;
  }

  if (user.user_role === '2') {
    return <EmployeeDashboard user={user} />;
  }

  return <div>Unauthorized</div>;
};

export default Dashboard;
