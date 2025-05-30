import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Directory from "./DashboardComponent/Directory";
import Attendance from "./DashboardComponent/Attendance";
import CompanyProfile from "./DashboardComponent/CompanyProfile";
import ImportantEvents from "./DashboardComponent/ImportantEvents";
import MyProfile from "./DashboardComponent/MyProfile";
import Leaves from "./DashboardComponent/Leaves";
import TeamChart from "./DashboardComponent/TeamChart";
import SpiritClub from "./DashboardComponent/SpiritClub";
import SupportTicket from "./DashboardComponent/SupportTicket";
import HelpDesk from "./DashboardComponent/HelpDesk";
import Layout from "./components/Layout";
import RightSidebar from "./components/RightSidebar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LoginRoute from "./components/Auth/CustomLoginRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/directory"
            element={
              <ProtectedRoute>
                <Directory />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/employee/dashboard" />} />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companyProfile"
            element={
              <ProtectedRoute>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/importantdates"
            element={
              <ProtectedRoute>
                <ImportantEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myprofile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <ProtectedRoute>
                <Leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teamchart"
            element={
              <ProtectedRoute>
                <TeamChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spiritclub"
            element={
              <ProtectedRoute>
                <SpiritClub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supportticket"
            element={
              <ProtectedRoute>
                <SupportTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk"
            element={
              <ProtectedRoute>
                <HelpDesk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sidebar"
            element={
              <ProtectedRoute>
                <RightSidebar />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
