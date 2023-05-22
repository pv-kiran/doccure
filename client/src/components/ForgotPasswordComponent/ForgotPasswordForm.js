import React from 'react'
import './ForgotPassword.css';


import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import registerLogo from '../../assets/login-banner.png';


import { useState } from 'react';

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  marginTop: '-.5rem',
  marginBottom: '2.5rem',
  borderRadius: '5px',
  padding: '.8rem' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
  }
}));

function ForgotPasswordForm() {

    const [isDoctor, setIsDoctor] = useState(true);

    const [user, setUser] = useState({  email: '' });

    const [formErrors, setFormErrors] = useState({ email: "" });
    
    let newErrors = { email: "" };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormErrors((prev) => {
            return {
                ...prev , [name] : ''
            }
        })
        setUser((prev) => {
            return {
                ...prev , [name]: value
            }
        })
    }

    const validateEmail = (email) => {
        // Regular expression to check for valid email format
        const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(email);
    };

     const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;


        if (!validateEmail(user.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        setFormErrors(newErrors); 

        if (isValid) {
            console.log(user);
            console.log('Valid');
        }
    }


    return (
         <Grid container
            sx={{
                height: '104vh',
                justifyContent: 'center',
                alignContent: 'center',
            }}
            spacing={2}
        >
            <Grid
                item  
                sx={{
                    display: { lg: 'flex' , md: 'flex' , sm:'none' , xs: 'none'},
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: {lg : '30rem' , md: '50%'}
                }}  
            > 
                <Box sx={{textAlign: 'center'}}>                
                  <img className='register-img' src={registerLogo} alt="" />
                </Box>
            </Grid>
            <Grid
                item
                sx={{
                    width: {lg: '30rem' , md: '50%'}
                }}
            >
                <Box
                    component="form"
                    onSubmit={(e) => handleSubmit(e)}
                    autoComplete="off"
                    sx={{
                        display:"flex" ,
                        flexDirection:"column" ,
                        gap:"75px" ,
                        border: "1px lightgray solid" ,
                        borderRadius :  "5px" ,
                        padding: "3rem",
                        width: { lg: '100%', md: '100%', sm: '20rem' } 
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: 'column' ,
                            justifyContent: "space-between",
                            marginBottom: '-2.5rem'
                        }}
                    >
                        <Typography
                            // variant='h6'
                            sx={{
                              fontSize: { lg: '1.2rem' ,  md: '1rem' , sm: '.9rem'}
                            }}
                        >
                            Forgot Password ?
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { lg: '.8rem', md: '.8rem', sm: '.7rem' },
                                color: 'gray'
                                // paddingTop: { lg: '.6rem', md: '.5rem', sm: '.2rem' },
                            }}
                        >
                            Enter your email to get a password reset link
                        </Typography>
                    </Box>
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        sx={{
                            width: "100%",
                            height: '.6rem'
                        }} 
                        name="email"
                        onChange={(e) => handleChange(e)}
                        error={Boolean(formErrors.email)}
                        helperText = {formErrors.email}
                    />
                    <ColorButton type='submit'>
                      Reset Password
                    </ColorButton>
                </Box> 
            </Grid>
            
        </Grid>
    )
}

export default ForgotPasswordForm