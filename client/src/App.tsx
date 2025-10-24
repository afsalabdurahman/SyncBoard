import LandingPage from "./Member/pages/LandingPage";

import LoginPage from "./Member/pages/Login";
import SignupPage from "./Member/pages/SignupPage";
import PasswordResetPage from "./Member/pages/PasswordResetPage";
import OtpVerification from "./Member/pages/OtpVerification";
import { BrowserRouter, Routes, Route } from "react-router";
import ForgotPasswordOtpPage from "./Member/pages/ForgotPasswordOtpPage";
import ChangePasswordPage from "./Member/pages/ChangePasswordPage";
import CreateWorkspacePage from "./Member/pages/CreateWorkspecePage";
import InviteMembers from "./Member/pages/InviteMembers";
import WorkSpacePage from "./Worksapce/pages/WorkSpacePage";
import LinkInvitaionPage from "./Worksapce/pages/LinkInvitationPage";
//import MulipleWorkspace from "./Member/components/landing/home/MulipleWorkspace/MulipleWorkspace";
import Profile from "./Worksapce/components/Profile";
import AdminDashboard from "./Admin/Pages/AdminDashboard";
import AdminLogin from "./Admin/Pages/AdminLogin";

import Invite from "./Worksapce/components/Invite";
import { Layout } from "./SuperAdmin/layout/Layout";
import { Login } from "./SuperAdmin/pages/Login";
// import CheckoutPage from "./Admin/Pages/CheckoutPage";

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
          <Route path='/invite-members' element={<InviteMembers />}></Route>
          <Route path='/work-space' element={<WorkSpacePage />}></Route>
          <Route
            path='/invite-members/:workspaceSlug'
            element={<LinkInvitaionPage />}
          ></Route>
          {/* <Route
            path='/multiple-workspace'
            element={<MulipleWorkspace />}
          ></Route> */}
          <Route path='/user-profile' element={<Profile />}></Route>
          {/* Admin DashBorad */}
          <Route path='/admin' element={<AdminLogin />}></Route>
          <Route path='/admin-dashboard' element={<AdminDashboard />}></Route>
          <Route path='/test' element={<Invite />}></Route>
         {/* // <Route path='/checkout' element={<CheckoutPage />}></Route> */}

          {/* SuperAdmin */}
          <Route path='/platform/login' element={<Login />} />
          <Route path='/platform/admin' element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
