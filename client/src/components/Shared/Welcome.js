import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material';

function Welcome() {
  const authState = useSelector((state) => {
    return state.auth.authState;
  })

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
      <Typography variant='h5'>
        Hello {authState.fullName}  .....!!
      </Typography>
      {
        authState.role === 'patient' ?  <Typography variant='subtitle1'
        sx={{
          width: '90%',
          margin: '2rem auto',
          textAlign: 'center',
          color: 'gray'
        }}>
        Welcome to our Online Consultation App! Connect with trusted healthcare professionals conveniently from anywhere, anytime."
      </Typography>  : <Typography variant='subtitle1'
        sx={{
          width: '90%',
          margin: '2rem auto',
          textAlign: 'center',
          color: 'gray'
        }}>
        We extend a warm welcome to you as valued members of our Online Consultation App. With your expertise and dedication, we aim to provide the highest quality healthcare services to our patients.
      </Typography> 
      }
    </Box>
  )
}

export default Welcome