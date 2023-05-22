import './App.css';
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';



function App() {
  return (
    <>
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/register" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/forgot/password" element={<ForgotPassword />} />
         <Route path="/reset/password" element={<ResetPassword />} />
        
      </Routes>
    </>
  );
}

export default App;
