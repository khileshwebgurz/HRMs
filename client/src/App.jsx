import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.js';
import "./custom.css";
import Dashboard from "./components/Dashboard";
import Directory from "./components/DashboardComponent/Directory";
import Attendance from "./components/DashboardComponent/Attendance";
import CompanyProfile from "./components/DashboardComponent/CompanyProfile";
import ImportantEvents from "./components/DashboardComponent/ImportantEvents";
import MyProfile from "./components/DashboardComponent/MyProfile";
import Leaves from "./components/DashboardComponent/Leaves";
import TeamChart from "./components/DashboardComponent/TeamChart";
import SpiritClub from "./components/DashboardComponent/SpiritClub";
import SupportTicket from "./components/DashboardComponent/TicketComponent/EmployeeTicket/SupportTicket";
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
import AddCandidate from "./components/AdminDashboardComponent/AddCandidate";
import AllNotification from "./components/Notification/AllNotification";
import AllTicketsIT from "./components/DashboardComponent/TicketComponent/ItAdminTicket/AllTicketsIT";
import NewTicket from "./components/DashboardComponent/TicketComponent/ItAdminTicket/NewTicket";
import ViewCandidateProfile from "./components/CandidateProfileComp/ViewCandidateProfile";
import EditCandidateProfile from "./components/CandidateProfileComp/EditCandidateProfile";
import TicketDetails from "./components/DashboardComponent/TicketComponent/ItAdminTicket/TicketDetails";
import Test from "./components/TestComponent/Test";
import ImportCandidate from "./components/AdminDashboardComponent/ImportCandidate";
import TestComplete from "./components/TestComponent/TestComplete";
import ScheduleInterview from "./components/ScheduleInterview/viewInterview";
import ViewInterviewInfo from "./components/ScheduleInterview/ViewInterview/ViewInterviewInfo";
import JobApplication from "./components/ManageCandidates/JobApplication";
import ReviewAptitudeTest from "./components/ManageCandidates/ReviewAptitudeTest";
import AptitudeTestComplete from "./components/ManageCandidates/AptitudeTestComplete";
import AttendanceReport from "./components/AdminDashboardComponent/attendanceReport";
import AdminSalarySlip from "./components/RightSidebarComponent/AdminSalarySlip";

function App() {
  const [isAdminMode, setIsAdminMode] = useState(true);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />

        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

           <Route path="/tracker/candidate/profile/:profile_token/edit"  element={<EditCandidateProfile/>}/>
           <Route path="/tracker/candidate/profile/:profile_id/view" element={<ViewCandidateProfile/>}/>
           <Route path="/test/:test_id" element={<Test />} />
           <Route path="/test-completed" element={<TestComplete />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout  isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode}/>
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
          <Route path="/edit-profile/personal" element={<MyProfile />} />
          <Route
            path="/profile/:profile_id/view"
            element={<CandidateProfile />}
          />
          <Route path="/tracker/candidates" element={<CandidateList />} />
          <Route
            path="/users/edit-candidate/:candidate_id"
            element={<CandidateEditForm />}
          />
          <Route path="/candidate/update" element={<CandidateEditForm />} />
          <Route path="/notifications" element={<AllNotification />} />
          <Route
            path="/users/candidate/all-candidates"
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
          <Route path="/import-candidates" element={<ImportCandidate/>}/>

          <Route
            path="/employee/account/salary-slip"
            element={<SalarySlip />}
          />

          <Route path="/public/salary-slip" element={<AdminSalarySlip/>}/>

          <Route path="/company-policy" element={<CompanyPolicy />} />
          <Route path="/readiness-quiz" element={<ReadinessQuiz />} />
          <Route path="/add-candidate" element={<AddCandidate />} />

          {/* ticket controller by it admin */}
          <Route
            path="/employee/ticket-system/:name"
            element={<AllTicketsIT />}
          />
          <Route
            path="/employee/ticket-system/detail/:ticketID"
            element={<TicketDetails />}
          />
          <Route
            path="/employee/support-ticket/newticket"
            element={<NewTicket />}
          />

           {/* email redirection urls for candidate creation*/}
           
           <Route path="/import-candidates" element={<ImportCandidate/>}/>

           {/* Interview Schedule */}
           <Route path="/public/interview/all-interviews" element={<ScheduleInterview/>}/>
           <Route path="/public/interview/view/:id" element={<ViewInterviewInfo/>}/>

           {/* Review Aptitude Test */}
           <Route path="/public/users/all-candidate-test" element={<ReviewAptitudeTest/>}/>
           <Route path="/public/users/candidate-test/:testid" element={<AptitudeTestComplete/>}/>

           <Route path="/career" element={<JobApplication/>}/>
           <Route path="/attendance-report" element={<AttendanceReport />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
