import './App.css';
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerify';
import PublicRoutes from './utils/PublicRoutes';
import ProtectedRoutes from './utils/ProtectedRoutes';
import EmailNotify from './pages/EmailNotify';




function App() {
  return (
    <>
      <Routes>
        
        <Route element={<PublicRoutes></PublicRoutes>}>
            <Route path="/signup" element={<Register />} />
            <Route path="/email/notification" element={<EmailNotify></EmailNotify>} />
            <Route path="/:usertype/verify/:token" element={<EmailVerification />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/forgot/password" element={<ForgotPassword />} />
            <Route path="/:userType/reset/password/:token" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoutes></ProtectedRoutes>}>
            <Route path="/" element={<Home />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
