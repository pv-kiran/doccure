import { Box, Typography } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux'

function PatientDoctorsTable() {

  const authState = useSelector((state) => {
    return state.auth.authState;
  })
  console.log(authState);

  return (
    <Box sx={{
      marginLeft: '10rem',
      display: 'flex',
      justifyContent: 'center',
      borderRadius: '1rem',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: '5rem',
      width: '75%',
      boxShadow: '.2rem .4rem 1rem .05rem rgba(1 , 1 , 1, .3)',
      padding: '3rem'
    }}>
      <img
        src={authState.profilePicture.secure_url}
        alt="profile" 
        style={{
          width: '10rem',
          height: '10rem',
          borderRadius: '100%',
          marginBottom: '3rem'
        }}
      />
      <Typography variant='h5'>Hello {authState.fullName}  .....!!</Typography>
      <Typography variant='subtitle1'
        sx={{
          width: '90%',
          margin: '2rem auto',
          textAlign: 'center',
          color: 'gray'
        }}>
        Welcome to our Online Consultation App! Connect with trusted healthcare professionals conveniently from anywhere, anytime."
      </Typography>
    </Box>
  )
}

export default PatientDoctorsTable