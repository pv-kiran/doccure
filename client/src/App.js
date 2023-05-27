import './App.css';
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerify';
import EmailNotify from './pages/EmailNotify';
import DashboardPatient from './pages/DashboardPatient';
import Onboarding from './pages/Onboarding';
import DashboardDoctor from './pages/DashboardDoctor';
import LoginAdmin from './pages/LoginAdmin';


// public routes
import PublicRoutes from './utils/PublicRoutes';


// protected routes
import PatientProtectedRoutes from './utils/PatientProtectedRoutes';
import DoctorProtectedRoutes from './utils/DoctorProtectedRoutes';
import AdminProtectedRoutes from './utils/AdminProtectedRoutes';


import { useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import DashboardAdmin from './pages/DashboardAdmin';


function App() {

  const location = useLocation()
  useEffect(() => {
    console.log(`${location.pathname} ... testing`);
  } , [location.pathname])

  return (
    <>
      <Routes>
        
        <Route path='/' element={<Home></Home>}></Route>
        
        <Route element={<PublicRoutes></PublicRoutes>}>
            <Route path="/signup" element={<Register />} />
            <Route path="/email/notification" element={<EmailNotify/>} />
            <Route path="/:usertype/verify/:token" element={<EmailVerification />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/forgot/password" element={<ForgotPassword />} />
            <Route path="/:userType/reset/password/:token" element={<ResetPassword />} />
            <Route path='/admin/signin' element={<LoginAdmin></LoginAdmin>}></Route>
        </Route>

        <Route element={<PatientProtectedRoutes></PatientProtectedRoutes>}>
          <Route path="/patient/onboarding" element={<Onboarding role='patient'/>} />
          <Route path="/patient/dashboard" element={<DashboardPatient />} />
        </Route>

        <Route element={<DoctorProtectedRoutes></DoctorProtectedRoutes>}>
          <Route path="/doctor/onboarding" element={<Onboarding role='doctor' />} />
          <Route path="/doctor/dashboard" element={ <DashboardDoctor />} />
        </Route>

        <Route element = {<AdminProtectedRoutes></AdminProtectedRoutes>}>
            <Route path='/admin/dashboard' element={<DashboardAdmin></DashboardAdmin>} />
        </Route>

        {/* <Route element={<ProtectedRoutes></ProtectedRoutes>}>
            <Route path="/" element={<Home />} />
        </Route> */} 

      </Routes>
    </>
  );
}

export default App;
