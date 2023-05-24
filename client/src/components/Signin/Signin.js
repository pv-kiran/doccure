import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import registerLogo from '../../assets/login-banner.png';
import './Signin.css';

// import { Link } from '@mui/material';

import { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logginDoctorReset, loginDoctor } from '../../app/features/doctor/doctorSlice';
import { logginPatientReset, loginPatient } from '../../app/features/patient/patientSlice';
import { setAuth } from '../../app/features/auth/authSlice';

import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from "@mui/material/FormHelperText"


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





function Signin() {

    const [isDoctor, setIsDoctor] = useState(true);

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

    let doctorLoginState = useSelector((state) => {
        return state.doctor;
    })

    let patientLoginState = useSelector((state) => {
        return state.patient;
    })

    // console.log(patientLoginState)
    // console.log(doctorLoginState)

    useEffect(() => {
        if(patientLoginState.success) {
            // console.log(patientLoginState.user.user)
            localStorage.setItem('user' , JSON.stringify(patientLoginState.user.user))
            dispatch(setAuth());
            dispatch(logginPatientReset());
            navigate('/')
        }
    }, [patientLoginState.success])
    

    useEffect(() => {
        if(doctorLoginState.success) {
            // console.log(doctorLoginState.user.user)
            localStorage.setItem('user' , JSON.stringify(doctorLoginState.user.user))
            dispatch(setAuth());
            dispatch(logginDoctorReset());
            navigate('/')
        }
    }, [doctorLoginState.success])
    
     useEffect(() => {
        if (doctorLoginState.error || patientLoginState.error) {
            const timer = setTimeout(() => {
                dispatch(logginDoctorReset())
                dispatch(logginPatientReset())
            }, 3000);
             return () => clearTimeout(timer);
        }
    }, [doctorLoginState.error , patientLoginState.error]);

    

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
            // console.log(user);
            // console.log('Valid');
            if (isDoctor) {
                dispatch(loginDoctor(user))
            } else {
                dispatch(loginPatient(user))
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
                            {
                                isDoctor ? 'Doctor Login' : 'Patient Login'
                            }
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { lg: '1rem', md: '1rem', sm: '.7rem' },
                                color: '#2CE1FE',
                                paddingTop: { lg: '.6rem', md: '.5rem', sm: '.2rem' },
                                cursor: 'pointer'
                            }}
                            onClick = { () => setIsDoctor(!isDoctor)}
                        >
                            {
                                
                                isDoctor ? 'Not a doctor ?' : 'Are you a doctor ?'
                                
                            }
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
                        disabled = {doctorLoginState.loading || patientLoginState.loading}
                    >
                        Sign In
                        {
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
                        }
                    </ColorButton>
                    <Box
                        sx={{
                            marginTop: '-2.5rem' ,
                            display:"flex",
                            justifyContent: "center"
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { lg: '1rem', md: '.8rem', sm: '.8rem' },
                                color: '#2CE1FE' ,
                                '&:hover': {
                                   color: '#0AE4B3',
                                },
                                textDecoration: 'none'
                            }}
                            component={Link} 
                            to={'/signup'}
                        >
                                Don't have an account ? Register
                        </Typography>
                    </Box>
                    {
                        (doctorLoginState.error || patientLoginState.error) && <FormHelperText
                                error
                                sx={{
                                    marginTop: '-5rem',
                                    textAlign: 'center',
                                    position: 'absolute',
                                    bottom: '4.5rem' ,
                                    width: '23rem' ,
                                    fontSize: '.9rem',
                                    // textTransform: 'capitalize',
                                }}
                                > {
                                doctorLoginState.error ||  patientLoginState.error
                            }
                        </FormHelperText>
                    }
                </Box> 
            </Grid>
            
        </Grid>

     
  )
}

export default Signin