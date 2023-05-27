import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function DoctorProtectedRoutes() {
  const authState = useSelector((state) => {
    return state.auth?.authState;
  })

  console.log('Doctor check');

  console.log(authState?.role);

  return (
     authState?.role === 'doctor' ? <Outlet/> : <Navigate to='/'/>
  )
}

export default DoctorProtectedRoutes