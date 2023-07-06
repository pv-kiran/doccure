import React from 'react'
import Grid from '@mui/material/Grid';
import  Box  from '@mui/material/Box';
import Typography from '@mui/material/Typography'

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import  Stack  from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import  Divider  from '@mui/material/Divider';

function Footer() {
    return (
      <Box sx={{
                backgroundColor: '#15558D',
            }}
      >
        {/* <Grid
            container
            spacing={8}
            sx={{
                backgroundColor: '#15558D',
                padding: '1rem 2rem',
                marginTop: '2rem'
            }}>
            <Grid item xl={4} sx={{width:'30%'}}>
                <Typography
                    variant='h5' 
                    fontWeight= 'bold'
                    sx={{
                        color: '#fff',
                        marginBottom: '1rem'
                    }}>
                    DOCCURE
                </Typography>
                <Typography
                    variant='subtitle1'
                    textAlign='justify'
                    color='white'
                >
                    Elevate your healthcare journey to unparalleled heights with Doccure – where exceptional care meets the art of digital innovation.
                    
                </Typography>
                <Stack
                    sx={{
                        marginTop: '1rem',
                        color: '#fff'
                    }}
                    spacing={2}
                    direction='row'
                >
                    <TwitterIcon />
                    <FacebookIcon />
                    <WhatsAppIcon />
                    <InstagramIcon/>
                </Stack>    
            </Grid>
            <Grid item xl={4} sx={{width:'20%'}}>
                <Typography
                    variant='h6'
                    fontWeight='bold'
                    marginBottom="1rem"
                    color='#fff'
                >
                    For Patients
                </Typography>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Search for Doctors</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Registration</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Login</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Booking</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Patient Dashboard</Typography>
                </Stack>
            </Grid>
            <Grid item xl={4} sx={{width:'20%'}}>
                <Typography
                    variant='h6'
                    fontWeight='bold'
                    marginBottom="1rem"
                    color='#fff'
                >
                    For Doctors
                </Typography>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Appointments</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Chat and Video call</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Registration</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Login</Typography>
                </Stack>
                
                <Stack direction='row' spacing={1}>
                    <KeyboardDoubleArrowRightIcon sx={{color: 'white'}} /> 
                    <Typography color='white'>Doctor Dashboard</Typography>
                </Stack>
            </Grid>
            <Grid item xl={4} sx={{width:'20%'}}>
                <Typography
                    variant='h6'
                    fontWeight='bold'
                    marginBottom="1rem"
                    color='#fff'
                >
                    Contact Us
                </Typography> 
                <Stack direction='row' spacing={1} marginBottom='.5rem'>
                    <LocationOnIcon fontSize='small' sx={{color: 'white'}} /> 
                    <Typography color='white'>Trivandrum , Kerala</Typography>
                </Stack>
                <Stack direction='row' spacing={1} marginBottom='.5rem'>
                    <PhoneIcon fontSize='small' sx={{color: 'white'}}/> 
                    <Typography color='white'>7899760000</Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                    <EmailIcon fontSize='small' sx={{color: 'white'}} /> 
                    <Typography color='white'>doccure@gmail.com</Typography>
                </Stack>
            </Grid>
        </Grid> */}
        <Divider sx={{ width: '95%' , backgroundColor: 'white' , margin: '1rem auto' }} />    
            <Box sx={{
                width: '95%',
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '1rem'
            }}>
             <Typography color='#fff'>© 2022 Doccure. All rights reserved.</Typography>   
             {/* <Typography color= '#fff'>Terms and Conditions | Policy</Typography>    */}
        </Box>    
      </Box>
  )
}

export default Footer