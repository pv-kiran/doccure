import React from 'react'
import { Route, Routes } from "react-router-dom"

// pages
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerify';
import EmailNotify from './pages/EmailNotify';
import Onboarding from './pages/Onboarding';
// import DashboardDoctor from './pages/DashboardDoctor';
import LoginAdmin from './pages/LoginAdmin';
import Doccure from './pages/Doccure';



// public routes
import PublicRoutes from './utils/PublicRoutes';


// protected routes
import PatientProtectedRoutes from './utils/PatientProtectedRoutes';
import DoctorProtectedRoutes from './utils/DoctorProtectedRoutes';
import AdminProtectedRoutes from './utils/AdminProtectedRoutes';
import AdminDashboardLayout from './utils/AdminDashboardLayout';
import DoctorDashboardLayout from './utils/DoctorDashboardLayout';



// components which are parts of layouts
import AdminDoctorsTable from './components/AdminDoctorsTable/DoctorsTableAdmin';
import AdminPatientsTable from './components/AdminPatientsTable/AdminPatientsTable';
import AdminTransactionsTable from './components/AdminTransactionsTable/AdminTransactionsTable';
import AdminSpecialitiesTable from './components/AdminSpeciatiesTable/AdminSpecialitiesTable';
import AdminCharts from './components/AdminCharts/AdminCharts';
import AdminAppointmentsTable from './components/AdminAppointmentsTable/AdminAppointmentsTable';





import DoctorPatientsTable from './components/DoctorPatientsTable/DoctorPatientsTable';
import DoctorAppointmentsTable from './components/DoctorAppointmentsTable/DoctorAppointmentsTable';
import DoctorNotifications from './components/DoctorNotifications/DoctorNotifications';
import DoctorMessages from './components/DoctorMessages/DoctorMessages';
import DoctorSchedulings from './components/DoctorSchedulings/DoctorSchedulings';
import DoctorCharts from './components/DoctorCharts/DoctorCharts';
import PatientDashboardLayout from './utils/PatientDashboardLayout';
import PatientDoctorsTable from './components/PatientDoctorsTable/PatientDoctorsTable';
import PatientAppointmentTable from './components/PateinetAppointmentsTable/PatientAppointmentTable';
import PatientNotifications from './components/PatientNotifications/PatientNotifications';
import PatientMessages from './components/PatientMessages/PatientMessages';
import ViewDoctors from './components/ViewDoctors/ViewDoctors';

function AppRoutes() {
  return (
    <Routes>
        
        <Route path='/' element={<Doccure></Doccure>}></Route>
        <Route path='/doctors/all' element={<ViewDoctors></ViewDoctors>}></Route>
        

        {/* Public routes */}
        <Route element={<PublicRoutes></PublicRoutes>}>
            <Route path="/signup" element={<Register />} />
            <Route path="/email/notification" element={<EmailNotify/>} />
            <Route path="/:usertype/verify/:token" element={<EmailVerification />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/forgot/password" element={<ForgotPassword />} />
            <Route path="/:userType/reset/password/:token" element={<ResetPassword />} />
            <Route path='/admin/signin' element={<LoginAdmin></LoginAdmin>}></Route>
        </Route>

        {/* Patient specfic routes */}
        <Route element={<PatientProtectedRoutes></PatientProtectedRoutes>}>
          <Route path="/patient/onboarding" element={<Onboarding role='patient' />} />
          <Route path='/patient' element={<PatientDashboardLayout/>}>
               <Route path='dashboard' element={<PatientDoctorsTable/>}></Route>
               <Route path='appointments' element={<PatientAppointmentTable/>}></Route>
               <Route path='notifications' element={<PatientNotifications/>}></Route>
               <Route path='messages' element={<PatientMessages/>}></Route>
          </Route>
        </Route>  

        {/* Doctor specific routes */}
        <Route element={<DoctorProtectedRoutes></DoctorProtectedRoutes>}>
          <Route path="/doctor/onboarding" element={<Onboarding role='doctor' />} />
          <Route path='/doctor' element={<DoctorDashboardLayout></DoctorDashboardLayout>}>
            <Route path='dashboard' element={<DoctorCharts></DoctorCharts>}></Route>
            <Route path='mypatients' element={<DoctorPatientsTable></DoctorPatientsTable>}></Route>
            <Route path='appointments' element={<DoctorAppointmentsTable/>}></Route>
            <Route path='notifications' element={<DoctorNotifications/>}></Route>
            <Route path='messagges' element={<DoctorMessages />}></Route>
            <Route path='schedulings' element={<DoctorSchedulings/>}></Route>
            
          </Route>
          {/* <Route path="/doctor/dashboard" element={ <DashboardDoctor />} /> */}
        </Route>

        {/* Admin related routes */}
        <Route element = {<AdminProtectedRoutes></AdminProtectedRoutes>}>
          <Route path='/admin' element={<AdminDashboardLayout></AdminDashboardLayout>}>
            <Route path='dashboard' element={<AdminCharts></AdminCharts>}></Route>        
            <Route path='doctors' element={<AdminDoctorsTable></AdminDoctorsTable>}></Route>
            <Route path='patients' element={<AdminPatientsTable></AdminPatientsTable>}></Route> 
            <Route path='appointments' element={<AdminAppointmentsTable></AdminAppointmentsTable>}></Route>  
            <Route path='transactions' element={<AdminTransactionsTable></AdminTransactionsTable>}></Route>        
            <Route path='specialities' element={<AdminSpecialitiesTable></AdminSpecialitiesTable>}></Route>        
          </Route>
        </Route>

        {/* <Route element={<ProtectedRoutes></ProtectedRoutes>}>
            <Route path="/" element={<Home />} />
        </Route> */} 

      </Routes>
  )
}

export default AppRoutes