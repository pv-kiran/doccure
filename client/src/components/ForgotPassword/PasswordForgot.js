import React from 'react'
import './PasswordForgot.css';


import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormHelperText from "@mui/material/FormHelperText"


import { Checkbox, FormControlLabel } from '@mui/material';
import registerLogo from '../../assets/login-banner.png';
import { useState , useEffect } from 'react';
import instance from '../../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

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



function PasswordForgot() {

    const navigate = useNavigate();

    

    const [user, setUser] = useState({ email: '' });
    const [formErrors, setFormErrors] = useState({ email: "" });
    let newErrors = { email: "" };

    
    const [checked, setChecked] = useState(false);

    const [error, setError] = useState('');


    const handleCheckBoxChange = () => {
        setChecked(!checked);
    };


    useEffect(() => {
        if (error) {
        const timer = setTimeout(() => {
            setError('')
        }, 3000);
        return () => clearTimeout(timer);
        }
    }, [error]);

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
        
        async function forgotPassword(userType) {
           try {
               
              await instance.put(`auth/${userType}/password/reset`, user);
              navigate('/email/notification')
               
           } catch (err) {
               setError(err.response.data.errorInfo);
           }
        }

        if (isValid) {
            if (checked) {
                forgotPassword('doctor');
            } else {
                forgotPassword('patient');
            }
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
                        gap: "75px",
                        position: 'relative',
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
                            marginBottom: '-5rem'
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
                    <FormControlLabel
                        control={<Checkbox
                                    sx={{ marginTop: '1px' }} 
                                    checked = { checked }
                                    onChange={handleCheckBoxChange}
                                />}
                        label="Are you a doctor?"
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontWeight: 'lighter',
                                fontSize: '.8rem'
                            },
                        }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        sx={{
                            width: "100%",
                            height: '.6rem',
                            marginTop: "-2rem"
                        }} 
                        name="email"
                        onChange={(e) => handleChange(e)}
                        error={Boolean(formErrors.email)}
                        helperText = {formErrors.email}
                    />
                    <ColorButton type='submit'>
                      Reset Password
                    </ColorButton>
                    {
                        error && <FormHelperText
                                error
                                sx={{
                                    marginTop: '-3rem',
                                    textAlign: 'center',
                                    position: 'absolute',
                                    bottom: '2rem' ,
                                    width: '23rem' ,
                                    fontSize: '.9rem',
                                    textTransform: 'capitalize',
                                }}
                                > {
                                  error
                                  }
                                </FormHelperText>
                        }
                </Box> 
            </Grid>
            
        </Grid>
    )
}

export default PasswordForgot