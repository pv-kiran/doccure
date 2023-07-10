import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../api/axiosInstance';
import Navbar from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import  Box  from '@mui/material/Box';
import  Stack  from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import  Typography  from '@mui/material/Typography';
import  Divider  from '@mui/material/Divider';
import  Button  from '@mui/material/Button';
import Rating from '@mui/material/Rating';

import { styled } from '@mui/material/styles';
import BookingInfo from '../Shared/BookingInfo';

import {  createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';


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

    const navigate = useNavigate();
    

    const theme = createTheme(); // Create an empty theme object
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  
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

    const {selectedDateId ,  selectedSlotId , startTime , endTime , bookedSlot } = appointmentState;


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


    // payment handler
    function loadScript(src) {
            return new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = src;
                script.onload = () => {
                    resolve(true);
                };
                script.onerror = () => {
                    resolve(false);
                };
                document.body.appendChild(script);
            });
    }

    const onConfirmPay = async () => {

        const bookedSlot = JSON.parse(localStorage.getItem('bookedSlot'))
        const fees = Number.parseInt(doctor[0]?.speciality?.fees)  + 50


        try {

            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const data = await instance.post('/appointment/initiate',
                        {
                            ...bookedSlot , fees
                        }
            )


            const options = {
                key: process.env.REACT_APP_RZP_KEY, // Enter the Key ID generated from the Dashboard
                amount: 450,
                currency: 'INR',
                name: "Soumya Corp.",
                description: "Test Transaction",
                // image: { logo },
                order_id: data.data.order.id,
                handler: async function (response) {

                    const appointmentDetails = {
                        ...bookedSlot,
                        fees,
                        paymentId: response.razorpay_payment_id ,
                        orderId: response.razorpay_order_id
                    }

                    const {data} = await instance.post('/appointment/create', appointmentDetails);

                    navigate(`/appointment/${data?.appointment?._id}/success`)

                    // alert(result.data.msg);
                },
                prefill: {
                    name: "Testing",
                    email: "test@gmail.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "Doccure",
                },
                theme: {
                    color: "#61dafb",
                },
            };
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            } catch (err) {
                console.log(err);
            }

    }

    const dateFormat = (date) => {
            const inputDate = new Date(date);
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const formattedDate = inputDate.toLocaleDateString('en-US', options);
            return formattedDate
    }


    return (
        <>
            <Navbar {...navBarProps}></Navbar>
            <Stack
                direction= {isSmallScreen ? 'column' : 'row'}
                spacing={5}
                sx={{
                    marginTop: '5rem',
                    padding: '2rem'
                }}>
                <Box
                    sx={{
                        width: {lg: '65%' , md: '65%' , sm: '100%' , xs:'100%'},
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
      
                        <ColorButton onClick={() => {onConfirmPay()}}>
                            Confirm Pay
                        </ColorButton>
                    </Stack>
                </Box>
                <Box sx={{
                    width: {lg:'30%' , md: '30%' , sm: '100%' , xs: '100%'},
                    border: '1px gray dotted',
                    borderRadius: '.3rem'
                }}>
                    <Typography variant='h5' padding= '1rem'>Booking Summary</Typography>
                    <Divider />
                    <Stack padding='.8rem' direction='row' spacing={2}>
                        <img style={{ width: '6rem', height: '6rem' , objectFit: 'contain'}}
                            src={doctor[0]?.profilePicture?.secure_url}
                            alt="speciality_img"    
                        />
                        <Box padding= '.3rem 0rem'>
                            <Typography variant='h6'>
                               Dr. {doctor[0]?.fullName}
                            </Typography>
                            <Typography
                                variant='subtitle1' 
                                sx={{color: 'gray'}}
                            >
                                  { doctor[0]?.speciality?.name}
                            </Typography>
                            <Rating name="read-only" size='small' value={2} readOnly />
                        </Box>
                    </Stack>
                    
                    <BookingInfo description={'Date'} info={dateFormat(bookedSlot?.selectedDate)} />
                    <BookingInfo description={'Start Time'} info={bookedSlot?.startTime}/>
                    <BookingInfo description={'End Time'} info={bookedSlot?.endTime}/>
                    <BookingInfo description={'Consultation Fee'} info={doctor[0]?.speciality?.fees}/>
                    <BookingInfo description={'Booking Fee'} info={50}/>
                    <Divider sx={{ width: '90%', margin: '.5rem auto' }} />
                    <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '.4rem 1.5rem'
                    }}>
                        <Typography
                            sx={{
                                fontSize: '1.5rem',
                                letterSpacing: '.3rem'
                            }}
                        >
                            Total
                        </Typography>
                        <Typography  sx={{
                                fontSize: '1.5rem',
                                letterSpacing: '.3rem'
                        }}>
                            {
                               doctor.length > 0 &&  Number.parseInt(doctor[0]?.speciality?.fees)  + 50
                            }
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </>
    )
}

export default Payment