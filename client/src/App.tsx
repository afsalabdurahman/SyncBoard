import LandingPage from "./Member/pages/LandingPage";

import LoginPage from "./Member/pages/Login";
import SignupPage from "./Member/pages/SignupPage";
import PasswordResetPage from "./Member/pages/PasswordResetPage";
import OtpVerification from "./Member/pages/OtpVerification";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ForgotPasswordOtpPage from "./Member/pages/ForgotPasswordOtpPage";
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
import { Layout } from "./SuperAdmin/Layout/Layout";
import { Login } from "./SuperAdmin/pages/Login";
import PaymentCompleted from "./Admin/Pages/PaymentCompleted";
import PaymentRejected from "./Admin/Pages/PaymentRejected";
// import OtpProtectedRoute from "./Member/protectedRoutes/OtpProtectedRoute";
import AuthProvider from "./Worksapce/protectedRoutes/AuthProvider"
import PublicRoute from"./Worksapce/protectedRoutes/PublicRoute";
import ProtectedRoute from"./Worksapce/protectedRoutes/ProtectedRoute";
// import CheckoutPage from "./Admin/Pages/CheckoutPage";
import  AddPassword  from "./Worksapce/components/AddPassword";

function App() {

  return (
    <>
    
      <BrowserRouter>
      
      <AuthProvider>
        q
        <Routes>
          <Route index element={
           

  <LandingPage />    
           
  
            
            } />
          <Route path='/' element={
         <PublicRoute>

 <LandingPage />
         </PublicRoute>

           
   

           
            
            }></Route>
          <Route path='/login' element={
            <PublicRoute>

           
<LoginPage />
           </PublicRoute> 
 

            }></Route>
          <Route path='/signup' element={<SignupPage />}></Route>
          <Route path='/verify/otp' element={
    // <OtpProtectedRoute>
      <OtpVerification />
    // </OtpProtectedRoute>
  }></Route>
          {/* <Route
            path='/reset/password'
            element={
           <OtpProtectedRoute>
<ForgotPasswordOtpPage />
           </OtpProtectedRoute>
              
          
          }
          ></Route> */}
          <Route
            path='/forgot/password'
            
            element={
                   <PublicRoute>

  <PasswordResetPage />
                   </PublicRoute>  
          }
          ></Route>
          <Route
            path='/change/password'
            element={
          
   <ChangePasswordPage />
          
          }
          ></Route>

<Route path="/add/password"
element={
  <AddPassword/>
}>

</Route>


          <Route
            path='/create/workspace'
            element={
             
 <CreateWorkspacePage />
            
           
          
          }
          ></Route>
          <Route path='/invite/members' element={
           
 <InviteMembers />
           
           
            
            
            }></Route>
          <Route path='/workspace' element={
         <ProtectedRoute>
 <WorkSpacePage />
         </ProtectedRoute>

            
            }></Route>
          <Route
            path='/invite-members/:workspaceSlug'
            element={
          
  <LinkInvitaionPage />
          
          
          
          }
          ></Route>
          {/* <Route
            path='/multiple-workspace'
            element={<MulipleWorkspace />}
          ></Route> */}
          <Route path='/user-profile' element={<Profile />}></Route>
          {/* Admin DashBorad */}
          <Route path='/admin' element={<AdminLogin />}></Route>
          <Route path='/admin/dashboard' element={
            <ProtectedRoute>
  <AdminDashboard />

            </ProtectedRoute>
          
            
            }></Route>
          <Route path='/test' element={<Invite />}></Route>
          <Route path='/payment/success' element={<PaymentCompleted/>}></Route>
          <Route path='/payment/cancel' element={<PaymentRejected/>}></Route>
         {/* // <Route path='/checkout' element={<CheckoutPage />}></Route> */}

          {/* SuperAdmin */}
          <Route path='/platform/login' element={<Login />} />
          <Route path='/platform/admin' element={<Layout />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
