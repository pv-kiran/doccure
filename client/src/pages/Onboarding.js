import React from 'react'
import UserOnboarding from '../components/UserOnboarding/UserOnboarding'
import { useSelector } from 'react-redux';

function Onboarding({ role }) {
  console.log(role);
  return (
    <UserOnboarding role = {role}></UserOnboarding>
  )
}

export default Onboarding