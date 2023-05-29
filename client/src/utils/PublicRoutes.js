import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoutes() {
  const authState = useSelector((state) => {
    return state.auth?.authState;
  })

  let redirect;


  if (authState?.role === 'doctor') {
    if (authState.fullName) {
      redirect = '/';
    } else {
      redirect = '/doctor/onboarding'
    }
  } 
  else if (authState?.role === 'patient') {
     if (authState?.fullName) {
      redirect = '/'
     } else {
      redirect = '/patient/onboarding'
     }
  }

  else {
    redirect = '/admin/dashboard';
  }

  return (
     !authState ? <Outlet /> : <Navigate to={  redirect} />
  )
}

export default PublicRoutes 
