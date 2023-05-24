import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import registerLogo from '../../assets/login-banner.png';
import './Signup.css';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerDoctor, registerDoctorReset } from '../../app/features/doctor/doctorSlice';
import { registerPatient, registerPatientReset } from '../../app/features/patient/patientSlice';
import { Link, useNavigate } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from "@mui/material/FormHelperText"




const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  marginTop: '-3rem',
  borderRadius: '5px',
  padding: '.8rem',
  position:'relative' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
  }
}));


function Signup() {


   




    const [isDoctor, setIsDoctor] = useState(true);

    const [user, setUser] = useState({ name: '', email: '', password: '' });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
        name: ""
    });

    let newErrors = { email: "", password: "", name: "" };

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


    let doctorRegisterState = useSelector((state) => {
        return state.doctor;
    })

    let patientRegiterState = useSelector((state) => {
        return state.patient;
    })

    // console.log(doctorRegisterState.loading)
    // console.log(patientRegiterState.loading)


   
    useEffect(() => {
        if (doctorRegisterState.success) {
            dispatch(registerDoctorReset());
            navigate('/email/notification')
        }
    }, [doctorRegisterState.success]);

     useEffect(() => {
        if (patientRegiterState.success) {
            dispatch(registerPatientReset());
            navigate('/email/notification')
        }
     }, [patientRegiterState.success]);
    
    useEffect(() => {
        if (patientRegiterState.error || doctorRegisterState.error) {
        const timer = setTimeout(() => {
            dispatch(registerDoctorReset())
            dispatch(registerPatientReset())
        }, 3000);
        return () => clearTimeout(timer);
        }
    }, [patientRegiterState.error , doctorRegisterState.error]);


    const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;

        if (user.name.length < 5) {
            newErrors.name = "Name must be at least 5 characters";
            isValid = false;
        }

        if (/\d/.test(user.name)) {
            newErrors.name = "Name must not include numbers";
            isValid = false;
        }

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
            console.log(user);
            console.log('Valid');
            if (isDoctor) {
               dispatch(registerDoctor(user));   
            } else {
                dispatch(registerPatient(user));
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
                              fontSize: { lg: '1.3rem' ,  md: '1rem' , sm: '.9rem'}
                            }}
                        >
                            {
                                isDoctor ? 'Doctor Register' : 'Patient Register'
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
                        // id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        sx={{
                            width: "100%",
                            height: '.6rem'
                        }} 
                        name="name" 
                        onChange={(e) => handleChange(e)}
                        error={Boolean(formErrors.name)}
                        helperText = {formErrors.name}
                    />
                    <TextField
                        // id="outlined-basic"
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
                        // id="outlined-basic"
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
                                fontSize: { lg: '1rem', md: '.8rem', sm: '.8rem' },
                                cursor: 'pointer',
                                textDecoration: 'none',
                                color: '#2CE1FE' ,
                                '&:hover': {
                                   color: '#0AE4B3',
                                },
                            }}
                            component={Link} 
                            to={'/signin'}
                        >
                                Alreay have an account ?
                        </Typography>
                    </Box>
                    <ColorButton type='submit' disabled = {doctorRegisterState.loading || patientRegiterState.loading}>
                        Sign Up
                        {
                           ( doctorRegisterState.loading || patientRegiterState.loading ) && <CircularProgress
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
                   
                        
                        {
                        (doctorRegisterState.error || patientRegiterState.error) && <FormHelperText
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
                                doctorRegisterState.error ||  patientRegiterState.error
                            } </FormHelperText>
                        }

                    
                </Box> 
            </Grid>
            
        </Grid>

     
  )
}

export default Signup