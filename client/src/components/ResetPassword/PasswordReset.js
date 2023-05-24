import React from 'react'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


import registerLogo from '../../assets/login-banner.png';
import './PasswordReset.css'


import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import instance from '../../api/axiosInstance';


import { Alert  } from '@mui/material';




const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  marginTop: '.5rem',
  borderRadius: '5px',
  padding: '.8rem' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
  }
}));



function PasswordReset() {

    const { userType, token } = useParams();
    console.log(userType);
    console.log(token);


    const [user, setUser] = useState({ password: '' , confirmPassword: '' });

    const [formErrors, setFormErrors] = useState({
       password: "" ,
       confirmPassword: '' 
    });
    
    let newErrors = { email: "", password: "", name: "" };

    const [status, setStatus] = useState('');
    

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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!/[a-zA-Z]/.test(user.password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(user.password)) {
            newErrors.password ="Password must include a character and a special character";
            isValid = false;
        }

        if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (user.confirmPassword !== user.password) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setFormErrors(newErrors); 



        async function resetPassword(userType, newPassword) {
            try {
                await instance.put(`/auth/${userType}/password/new`, newPassword); 
                setStatus('success');
            } catch (err) {
                setStatus('error');
            }
        }



        if (isValid) {
            const newPassword = {
                password: user.password,
                confirmPassword: user.confirmPassword,
                passwordToken: token
            }
            resetPassword(userType , newPassword);
        }

    }
  



    return (
      
        <>
            
            <Grid container
                sx={{
                    height: '104vh',
                    justifyContent: 'center',
                    alignContent: 'center',
                    position:'relative'
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
                                display:"flex" ,
                                alignItems: "center" ,
                                justifyContent: "space-between",
                                marginBottom: '-1.5rem'
                            }}
                        >
                            <Typography
                                // variant='h6'
                                sx={{
                                fontSize: { lg: '1.5rem', md: '1.3rem', sm: '.9rem' } ,
                                marginBottom:'-2rem' 
                                }}
                            >
                                Reset Password
                            </Typography>
                        </Box>
                        
                        <TextField
                            id="outlined-basic"
                            label="Password"
                            variant="outlined"
                            sx={{
                                width: "100%",
                                height: '.6rem'
                            }}     
                            name="password" 
                            type= "password"
                            onChange={(e) => handleChange(e)}
                            error={Boolean(formErrors.password)}
                            helperText = {formErrors.password}
                    />
                    
                    <TextField
                            id="outlined-basic"
                            label="Confirm Password"
                            variant="outlined"
                            sx={{
                                width: "100%",
                                height: '.6rem'
                            }}     
                            name="confirmPassword" 
                            type= "password"
                            onChange={(e) => handleChange(e)}
                            error={Boolean(formErrors.confirmPassword)}
                            helperText = {formErrors.confirmPassword}
                        />
                        <ColorButton type='submit'>
                        Change Password
                        </ColorButton>
                    </Box> 
                </Grid>

                {

                    status === 'success' && <Alert
                        severity="success"
                        sx={{
                            position: 'absolute',
                            bottom: '30px'
                        }}
                    >
                        Password update successful! Click <Typography
                        component={Link}
                        to="/signin"
                        sx={{
                            color: 'green'
                        }}
                        > here </Typography> to login
                    </Alert>

                }

                {

                    status === 'error' && <Alert
                        severity="error"
                        sx={{
                            position: 'absolute',
                            bottom: '30px'
                        }}
                    >
                        Password token expired! Click
                        <Typography
                            component={Link}
                            to="/forgot/password"
                            sx={{
                                color: 'red'
                            }}
                        >
                            here
                            
                        </Typography> to try again
                    </Alert>


                }
   
            </Grid>

        </>
   
      
      
      
  )
}

export default PasswordReset