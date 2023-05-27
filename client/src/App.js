import './App.css';
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerify';
import PublicRoutes from './utils/PublicRoutes';
import EmailNotify from './pages/EmailNotify';
import PatientProtectedRoutes from './utils/PatientProtectedRoutes';
import DoctorProtectedRoutes from './utils/DoctorProtectedRoutes';
import DashboardPatient from './pages/DashboardPatient';
import Onboarding from './pages/Onboarding';
import DashboardDoctor from './pages/DashboardDoctor';




function App() {
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
        </Route>

        <Route element={<PatientProtectedRoutes></PatientProtectedRoutes>}>
          <Route path="/patient/onboarding" element={<Onboarding role='patient'/>} />
          <Route path="/patient/dashboard" element={<DashboardPatient />} />
        </Route>

        <Route element={<DoctorProtectedRoutes></DoctorProtectedRoutes>}>
          <Route path="/doctor/onboarding" element={<Onboarding role='doctor' />} />
          <Route path="/doctor/dashboard" element={ <DashboardDoctor />} />
          
        </Route>

        {/* <Route element={<ProtectedRoutes></ProtectedRoutes>}>
            <Route path="/" element={<Home />} />
        </Route> */} 

      </Routes>
    </>
  );
}

export default App;
