import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import registerLogo from '../../assets/login-banner.png';
import './SigninAdmin.css';

// import { Link } from '@mui/material';

import { useState , useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';



import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from "@mui/material/FormHelperText";


import { adminLoginStateReset, loginAdmin } from '../../app/features/admin/adminSlice';
import { setAuth } from '../../app/features/auth/authSlice';





const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  marginTop: '-3rem',
  borderRadius: '5px',
  padding: '.8rem' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
  }
}));





function SigninAdmin() {

    const loginAdminState = useSelector((state) => {
        return state.admin
    })

    console.log(loginAdminState.success);

    useEffect(() => {
        if (loginAdminState.success) {
           console.log(loginAdminState.user.user)
            localStorage.setItem('user', JSON.stringify(loginAdminState.user.user))
            navigate('/admin/dashboard');
            dispatch(setAuth());
            dispatch(adminLoginStateReset());
        }

    }, [loginAdminState.success])
    
    useEffect(() => {
        if (loginAdminState.error) {
            const timer = setTimeout(() => {
                dispatch(adminLoginStateReset())
            }, 3000)
            return () => {
                clearTimeout(timer);
            }
        }

    } , [loginAdminState.error])

    const [user, setUser] = useState({ email: '', password: '' });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: ""
    });

    let newErrors = { email: "", password: ""};


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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!validateEmail(user.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        if (!/[a-zA-Z]/.test(user.password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(user.password)) {
            newErrors.password ="Password must include a character and a special character";
            isValid = false;
        }

        if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setFormErrors(newErrors); 

        if (isValid) {
            dispatch(loginAdmin(user));
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
                        width: { lg: '100%', md: '100%', sm: '20rem' },
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            display:"flex" ,
                            alignItems:"center" ,
                            justifyContent: "space-between",
                            marginBottom: '-1.5rem'
                        }}
                    >
                        <Typography
                            // variant='h6'
                            sx={{
                              fontSize: { lg: '1.3rem' ,  md: '1rem' , sm: '.9rem'}
                            }}
                        >
                            Admin Login
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
                    <Box
                        sx={{
                            display:"flex",
                            justifyContent:"end"
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { lg: '1rem', md: '.8rem', sm: '.8rem' } ,
                                color: '#2CE1FE' ,
                                '&:hover': {
                                   color: '#0AE4B3',
                                },
                                textDecoration: 'none'
                            }}
                            component={Link}
                            to={'/forgot/password'}
                        >
                                Forgot password ?
                        </Typography>
                    </Box>
                    <ColorButton
                        type='submit'
                        // disabled = {doctorLoginState.loading || patientLoginState.loading}
                    >
                        Admin Login
                        {/* {
                           ( doctorLoginState.loading || patientLoginState.loading ) && <CircularProgress
                                size={28}
                                sx={{
                                color: '#fff',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                            />
                        } */}
                    </ColorButton>
                    <Box
                        sx={{
                            marginTop: '-2.5rem' ,
                            display:"flex",
                            justifyContent: "center"
                        }}
                    >
                    </Box>
                    {
                        loginAdminState.error && <FormHelperText
                                error
                                sx={{
                                    marginTop: '-5rem',
                                    textAlign: 'center',
                                    position: 'absolute',
                                    bottom: '2.5rem' ,
                                    width: '23rem' ,
                                    fontSize: '.9rem',
                                    // textTransform: 'capitalize',
                                }}
                                > {
                                loginAdminState.error 
                            }
                        </FormHelperText>
                    }
                </Box> 
            </Grid>
            
        </Grid>

     
  )
}

export default SigninAdmin
