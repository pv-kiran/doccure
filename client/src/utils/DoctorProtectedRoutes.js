import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function DoctorProtectedRoutes() {
  const authState = useSelector((state) => {
    return state.auth?.authState;
  })


  return (
     authState?.role === 'doctor' ? <Outlet/> : <Navigate to='/signin'/>
  )
}

export default DoctorProtectedRoutes