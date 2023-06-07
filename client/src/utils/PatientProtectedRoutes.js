import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PatientProtectedRoutes() {
  const authState = useSelector((state) => {
    return state.auth?.authState;
  })
  
  
   return (
     authState?.role === 'patient' ? <Outlet/> : <Navigate to='/signin'/>
   )
}

export default PatientProtectedRoutes