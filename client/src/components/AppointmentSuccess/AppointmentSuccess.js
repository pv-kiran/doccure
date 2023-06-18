import  Box  from '@mui/material/Box'
import  Typography  from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import  Button  from '@mui/material/Button';

import './AppointmentSuccess.css';
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedSlot } from '../../app/features/appointment/appointmentSlice';



const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  borderRadius: '5px',
  padding: '.8rem',
  position:'relative' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
  }
}));





function AppointmentSuccess() {

      const { id } = useParams();
  
      const [details, setDetails] = useState(null);
  
      const appointmentState = useSelector((state) => {
         return  state.appointment
      })  

    console.log(appointmentState);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])

      useEffect(() => {
          async function fetchDetails(slotDetials) {
              console.log(slotDetials);
              let {data} = await instance.get(`/appointment/${id}/details`);
              setDetails(data.details);
          }
          fetchDetails(appointmentState.bookedSlot);
      }, []);
  
      const dateFormat = (date) => {
            const inputDate = new Date(date);
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const formattedDate = inputDate.toLocaleDateString('en-US', options);
            return formattedDate
      }

  return (
        <>
           {
              details &&  <Box className="container">
                  <Typography variant='h4' letterSpacing={2}>Appointment Confirmation</Typography>
                  <Typography variant='subtitle1'>Thank you for booking an appointment with us!</Typography>

                  <Box className="details">
                      <Typography variant='h5'>Appointment Details</Typography>
                       <Typography variant='subtitle1'><strong>Doctor:</strong> {details?.doctorName }</Typography>
                      <Typography variant='subtitle1'>
                          <strong>Date:</strong> {dateFormat(appointmentState?.bookedSlot?.selectedDate)}
                      </Typography>
                      <Typography variant='subtitle1'>
                          <strong style={{marginRight: '.5rem'}}>Time:</strong>
                          {appointmentState?.bookedSlot?.startTime} - {appointmentState.bookedSlot?.endTime}
                      </Typography>
                      
                  </Box>


                  <Typography  variant='h6' margin='1rem'>We look forward to seeing you soon!</Typography>

                  <ColorButton
                      onClick={() => {
                          navigate('/patient/appointments');
                          localStorage.removeItem('bookedSlot');
                          dispatch(clearSelectedSlot());
                      }}
                      fullWidth>
                      Dashboard
                  </ColorButton>
              </Box>
           }
        </>
        
    )
}

export default AppointmentSuccess