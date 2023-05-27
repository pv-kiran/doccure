import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PatientProtectedRoutes() {
  const authState = useSelector((state) => {
    return state.auth?.authState;
  })
  
  console.log('Patient check');
  
   return (
     authState?.role === 'patient' ? <Outlet/> : <Navigate to='/'/>
   )
}

export default PatientProtectedRoutes