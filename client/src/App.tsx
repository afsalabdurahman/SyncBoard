import LandingPage from "./components/page-components/landing/home/LandingPage";

import LoginPage from "./components/page-components/AuthrizationPage/Login";
import SignupPage from "./components/page-components/AuthrizationPage/SignupPage";
import PasswordResetPage from "./components/page-components/AuthrizationPage/PasswordResetPage";
import OtpVerification from "./components/page-components/AuthrizationPage/OtpVerification";
import { BrowserRouter, Routes, Route } from "react-router";
import ForgotPasswordOtpPage from "./components/page-components/AuthrizationPage/ForgotPasswordOtpPage";
import ChangePasswordPage from "./components/page-components/AuthrizationPage/ChangePasswordPage";
import CreateWorkspacePage from "./components/page-components/landing/home/CreateProject/CreateWorkspecePage";
import InviteMembers from "./components/page-components/landing/home/CreateProject/InvitePage/InviteMembers";
import WorkSpacePage from "./components/work-space-component/WorkSpacePage";
import LinkInvitaionPage from "./components/work-space-component/InvitationPage/LinkInvitationPage";
import MulipleWorkspace from "./components/page-components/landing/home/MulipleWorkspace/MulipleWorkspace";
import Profile from "./components/work-space-component/component-feeds/Profile/Profile";
import AdminDashboard from "./Admin/Pages/AdminDashboard";
import AdminLogin from "./Admin/Pages/AdminLogin";
import Invite from "./components/work-space-component/component-feeds/Invite";
import {Layout} from "./SuperAdmin/Layout/Layout"
import {Login} from "./SuperAdmin/pages/Login"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path='/' element={<LandingPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/signup' element={<SignupPage />}></Route>
          <Route path='/verify-otp' element={<OtpVerification />}></Route>
          <Route
            path='/reset-password'
            element={<ForgotPasswordOtpPage />}
          ></Route>
          <Route
            path='/forgot-password'
            element={<PasswordResetPage />}
          ></Route>
          <Route
            path='/change-password'
            element={<ChangePasswordPage />}
          ></Route>
          <Route
            path='/create-workspace'
            element={<CreateWorkspacePage />}
          ></Route>
             <Route
            path='/invite-members'
            element={<InviteMembers />}
          ></Route>
            <Route
            path='/work-space'
            element={<WorkSpacePage />}
          ></Route>
           <Route
            path='/invite-members/:workspaceSlug'
            element={<LinkInvitaionPage />}
          ></Route>
           <Route
            path='/multiple-workspace'
            element={< MulipleWorkspace/>}
          ></Route>
          <Route
            path='/user-profile'
            element={< Profile/>}
          ></Route>
          {/* Admin DashBorad */}
          <Route
            path='/admin'
            element={< AdminLogin/>}
          ></Route>
           <Route
            path='/admin-dashboard'
            element={< AdminDashboard/>}
          ></Route>
          <Route
            path='/test'
            element={< Invite/>}
          ></Route>
          {/* SuperAdmin */}
         <Route path="/platform/login" element = {<Login/>}/>
          <Route path="/platform/admin"
          element ={<Layout/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
