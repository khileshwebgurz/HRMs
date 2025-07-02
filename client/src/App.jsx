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
import LeaveLogs from "./components/Admin/LeaveLogs";
import NotFound from "./DashboardComponent/NotFound";
import ChangePassword from "./components/Auth/ChangePassword";
import RoleTable from "./components/RoleTable";
import CreateRoleForm from "./components/CreateRoleForm";
<<<<<<< Updated upstream
=======
import { useUser } from "./context/UserContext";
>>>>>>> Stashed changes
import CandidateList from "./components/AdminDashboardComponent/allCandidates";
import CandidateProfile from "./components/AdminDashboardComponent/getCandidatesProfile";
import CandidateEditForm from "./components/AdminDashboardComponent/editCandidates";

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

          <Route index element={<Navigate to="/dashboard" />} />

          {/* Single dynamic dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
          
           
          
          <Route path="/roles" element={<RoleTable />} />
          <Route path="/roles/add" element={<CreateRoleForm />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/employee/attendance" element={<Attendance />} />
          <Route path="/companyProfile" element={<CompanyProfile />} />
          <Route path="/leaves/leave-logs" element={<LeaveLogs />} />
          <Route path="/importantdates" element={<ImportantEvents />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/teamchart" element={<TeamChart />} />
          <Route path="/spiritclub" element={<SpiritClub />} />
          <Route path="/supportticket" element={<SupportTicket />} />
          <Route path="/helpdesk" element={<HelpDesk />} />
          <Route path="/sidebar" element={<RightSidebar />} />
          <Route path="/profile/view/:profile_id" element={<CandidateProfile/>}/>
          <Route path="/trackercandidates" element={<CandidateList />} />
          <Route path="/candidate/edit/:candidate_id" element={<CandidateEditForm />}/>
          <Route path="/candidate/update" element={<CandidateEditForm />}/>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
