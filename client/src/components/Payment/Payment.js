import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import instance from '../../api/axiosInstance';
import Navbar from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import  Box  from '@mui/material/Box';
import  Stack  from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import  Typography  from '@mui/material/Typography';
import  Divider  from '@mui/material/Divider';
import  Button  from '@mui/material/Button';


import { styled } from '@mui/material/styles';


const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  marginTop: '2rem',
  borderRadius: '5px',
  padding: '.6rem .8rem',
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
  }
}));



function Payment() {
 
    const { id } = useParams();

    const [doctor, setDoctors] = useState([]);

    
  
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])

    useEffect(() => {
        const fetchDoctor = async (id) => {

            try {
                let { data } = await instance.get(`appointment/doctor/${id}`);
                setDoctors(data.doctor);
                // console.log(doctor);
            } catch (err) {
                console.log(err);
            }
        }
        fetchDoctor(id);

    }, [])

    const authState = useSelector((state) => {
      return state?.auth?.authState;
    })

    const appointmentState = useSelector((state) => {
      return state.appointment
    })

    console.log(appointmentState);

    const userInfo = {
        userName: authState.name,
        fullName: authState.fullName,
        email: authState.email,
        phone: authState.phone,
        city: authState.address.city,
        state: authState.address.state
    }

    const [userDetails, setUserDetails] = useState(userInfo);


    const handleFieldChange = (field, value) => {
        setUserDetails(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const navBarProps = {
        page: 'home',
        bgColor: '#fff',
        color: 'green'
    }

    return (
        <>
            <Navbar {...navBarProps}></Navbar>
            <Stack
                direction= 'row'
                sx={{
                    border: '2px red solid',
                    marginTop: '5rem',
                    padding: '2rem'
                }}>
                <Box
                    sx={{
                        // border: '2px green solid',
                        width: '65%',
                        // display: 'flex',
                        // flexDirection: 'column',
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        border: '1px gray dotted',
                        padding: '1rem 0',
                        borderRadius: '.5rem'
                    }}>
                    <Typography
                        variant='h5'
                        sx={{
                            alignSelf: 'flex-start',
                            paddingLeft: '3.5rem',
                            marginBottom: '1.5rem'
                        }}>
                        Personal Info
                    </Typography>
                    {/* <Divider sx={{marginBottom: '1rem'}}/> */}
                    <Stack direction= 'column' spacing={3} padding= '0 3.5rem'>
                        <TextField
                            id="fullName"
                            label="Full name"
                            variant="outlined"
                            value={userDetails.fullName}
                            onChange={e => handleFieldChange('fullName', e.target.value)}
                        />
                        <TextField
                            id="userName"
                            label="Username"
                            variant="outlined"
                            value={userDetails.userName}
                            onChange={e => handleFieldChange('userName', e.target.value)}
                        />
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            value={userDetails.email}
                            onChange={e => handleFieldChange('email', e.target.value)}
                        />
                        <TextField
                            id="phone"
                            label="Phone"
                            variant="outlined"
                            value={userDetails.phone}
                            onChange={e => handleFieldChange('phone', e.target.value)}
                        />
      
                        <ColorButton
                        //   onClick={() => navigate(`/doctor/${id}/checkout`)}
                          sx={{
                           }}>
                            Confirm Pay
                        </ColorButton>
                    </Stack>
                </Box>
                <Box>
                
                </Box>
            </Stack>
        </>
    )
}

export default Payment