import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboard";
import Directory from "./components/DashboardComponent/Directory";
import Attendance from "./components/DashboardComponent/Attendance";
import CompanyProfile from "./components/DashboardComponent/CompanyProfile";
import ImportantEvents from "./components/DashboardComponent/ImportantEvents";
import MyProfile from "./components/DashboardComponent/MyProfile";
import Leaves from "./components/DashboardComponent/Leaves";
import TeamChart from "./components/DashboardComponent/TeamChart";
import SpiritClub from "./components/DashboardComponent/SpiritClub";
import SupportTicket from "./components/DashboardComponent/SupportTicket";
import HelpDesk from "./components/DashboardComponent/HelpDesk";
import Layout from "./components/Layout";
import RightSidebar from "./components/RightSidebar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LoginRoute from "./components/Auth/CustomLoginRoute";
import LeaveLogs from "./components/Admin/LeaveLogs";
import NotFound from "./components/DashboardComponent/NotFound";
import ChangePassword from "./components/Auth/ChangePassword";
import RoleTable from "./components/RoleTable";
import CreateRoleForm from "./components/CreateRoleForm";
import CandidateList from "./components/AdminDashboardComponent/allCandidates";
import CandidateProfile from "./components/AdminDashboardComponent/getCandidatesProfile";
import CandidateEditForm from "./components/AdminDashboardComponent/editCandidates";
import ActiveCandidatesList from "./components/AdminDashboardComponent/activeCandidatesList";
import QuestionsList from "./components/AdminDashboardComponent/questionsList";
import AddQuestion from "./components/AdminDashboardComponent/addQuestion";
import EditQuestion from "./components/AdminDashboardComponent/editQuestion";
import ActiveEmployees from "./components/AdminDashboardComponent/activeEmployees";
import AddEmployee from "./components/AdminDashboardComponent/addEmployees";
import SetPassword from "./components/AdminDashboardComponent/SetPassword";
import PersonalDetail from "./components/AdminDashboardComponent/PersonalDetail";
import EditEmployeeForm from "./components/AdminDashboardComponent/EditEmployeeForm";
import CompanyPolicy from "./components/CompanyPolicy";
import ReadinessQuiz from "./components/ReadinessQuiz";
import SalarySlip from "./components/RightSidebarComponent/SalarySlip";
import ForgotPasswordForm from "./components/Auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/Auth/ResetPasswordForm";
// import AddCandidate from "./components/AdminDashboardComponent/AddCandidate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
       
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />

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
          <Route path="/edit-profile/personal" element={<MyProfile/>}/>
          <Route
            path="/profile/:profile_id/view"
            element={<CandidateProfile />}
          />
          <Route path="/trackercandidates" element={<CandidateList />} />
          <Route
            path="/users/edit-candidate/:candidate_id"
            element={<CandidateEditForm />}
          />
          <Route path="/candidate/update" element={<CandidateEditForm />} />
          <Route
            path="/candidate/all-candidates"
            element={<ActiveCandidatesList />}
          />
          <Route path="/all-questions" element={<QuestionsList />} />
          <Route path="/add-question" element={<AddQuestion />} />
          <Route
            path="/edit-question/:question_id"
            element={<EditQuestion />}
          />
          <Route path="/all-employees" element={<ActiveEmployees />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/set-password/:type/:token" element={<SetPassword />} />
          {/* <Route path="/set-password/:token" element={<SetPassword />} /> */}
          <Route
            path="users/employee/:userId/view/personal"
            element={<PersonalDetail />}
          />
          <Route path="/edit-employee/:userId" element={<EditEmployeeForm />} />

          <Route path="/employee/account/salary-slip" element={<SalarySlip/>}/>

          <Route path="/company-policy" element={<CompanyPolicy />} />
          <Route path="/readiness-quiz" element={<ReadinessQuiz />} />  
           {/* <Route path="/add-candidate" element={<AddCandidate />} /> */}


          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
