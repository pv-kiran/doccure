import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../api/axiosInstance';
import { Box, Button } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import SchedulingCard from '../Shared/SchedulingCard';
import DoctorVerticalCard from '../Shared/DoctorVerticalCard';
import  Stack  from '@mui/material/Stack';



// tab implementation
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import SendIcon from '@mui/icons-material/Send';
import Toast from '../Shared/Toast';


import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { saveSelectedSlot, setSelectedDateId,  } from '../../app/features/appointment/appointmentSlice';


import {  createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';




const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2CE1FE',
  fontsize: '2rem',
  marginTop: '2rem',
  borderRadius: '5px',
  padding: '.6rem .8rem',
  position:'relative' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#0AE4B3',
  }
}));



// tab implementation
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component = 'div'>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// tab implementation
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// tab implementation
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}



function SlotBooking() {
    
    const { id } = useParams();
  const navigate = useNavigate();
  const myTheme = createTheme(); // Create an empty theme object
  const isSmallScreen = useMediaQuery(myTheme.breakpoints.down('md'));
  
 
    const [doctor, setDoctors] = useState([]);

    const appointmentState = useSelector((state) => {
        return state.appointment
    })

    const { selectedDateId, selectedSlotId, startTime, endTime, selectedDate } = appointmentState;
    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('success');

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
                setShowAlert(true);
                setAlertMessage('Something went wrong')
                setSeverity('error');
            }
        }
        fetchDoctor(id);
    }, [])
  
  
  
    const handleLike =  async () => {
        try {
          const { data } = await instance.put(`/patient/doctor/${doctor[0]?._id}/like`);
          setDoctors([data.doctor]);
          setShowAlert(true);
          setAlertMessage('You have liked the doctor')
        } catch (err) {
          setShowAlert(true);
          setAlertMessage(err?.response?.data?.errorInfo)
          setSeverity('error');
        } 
    };
  

    const handleRatings =  async (rating) => {
        try {
          const { data } = await instance.put(`/patient/doctor/${doctor[0]?._id}/rating` , {rating});
          setDoctors([data.doctor]);
          setShowAlert(true);
          setAlertMessage('You have rated the doctor')
        } catch (err) {
          setShowAlert(true);
          setAlertMessage(err?.response?.data?.errorInfo)
          setSeverity('error');
        } 
    };
  
    const [comment, setComment] = useState('');
    
    const handleCommentChange = (e) => {
      setComment(e.target.value)
    }
  
    const handleCommentSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await instance.put(`/patient/doctor/${doctor[0]?._id}/comment`, { comment })
        setDoctors([data.doctor])
        setComment('')
        setShowAlert(true);
        setAlertMessage('You have reviewed the doctor')
      } catch (err) {
          setShowAlert(true);
          setAlertMessage(err?.response?.data?.errorInfo)
          setSeverity('error');
      }

    }

  
    const dispatch = useDispatch();
    

    let dateArray = [];

    if (doctor[0]?.availableSlots) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filteredDateArray = doctor[0].availableSlots?.filter(slot => new Date(slot.date) >= today);
      dateArray = filteredDateArray.map(slot => {
          return {
              date: slot.date,
              _id: slot._id
          };
      });
      dateArray.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
      });

    }
        
    const [selectedId, setSelectedId] = useState(dateArray.length > 0 ? dateArray[0]._id : null);

    useEffect(() => {
      if (dateArray.length > 0) {
        dispatch(setSelectedDateId({ _id: dateArray[0]._id, date: dateArray[0].date }));
           setSelectedId(dateArray[0]._id);
        }
    }, [dateArray.length]);

    const onClickDate = (_id, date) => {
        setSelectedId(_id);
        dispatch(setSelectedDateId({_id:_id , date: date}));
    };


    const dateSlotes = doctor[0]?.availableSlots?.filter(data => data._id === selectedId) || [];



    const navBarProps = {
        page: 'home',
        bgColor: '#fff',
        color: 'green'
    }

    const schedulingCardProps = {
        dateArray,
        dateSlotes,
        selectedId,
        onClickDate,
        role: 'patient'
    }


    // tab implementation
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };


    const appointmentDetails = {
            doctorId : id , 
            dateId : selectedDateId,
            slotId :selectedSlotId,
            startTime : startTime,
            endTime: endTime ,
            selectedDate: selectedDate
    }
  
 


    return (
      <>
        <Navbar {...navBarProps}></Navbar>  
        <Stack
          direction={isSmallScreen ? 'column' : 'row'}
        >
            <Box sx={{
                    marginTop: '4rem',
                    height: 'auto',
                    padding: '2rem 1rem',
                    width: {lg: '30%' , md: '30%' , sm: '100%' , xs: '100%'}
            }}>
                {
                        doctor.length > 0  && doctor.map((doctor) => 
                          <DoctorVerticalCard
                            key={doctor._id}
                            doctor={doctor} 
                            handleLike={handleLike}
                            handleRatings={handleRatings}
                          />
                        )
                }       
            </Box>
            <Box sx={{
                    width: '65%',
                    height: { lg: '81vh' , md:'81vh'  , sm: 'auto' , xs: 'auto' },
                    margin: 'auto',
                    marginTop: '6rem',
                    border: '1px #d4d3d2 dotted',
                    borderRadius: '.4rem',
                    position: 'relative'
                }}>
                    
                    <Box sx={{
                        bgcolor: 'background.primary',
                        width: '100%', 
                    }}>
                     <AppBar sx={{bgcolor: 'rgb(243,249,255)' , borderRadius: '.4rem .4rem 0 0' , padding: 0}} elevation={0} position="static">
                     <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: 'gray' // Set the desired color here
                            }
                        }}
                     >
                        <Tab label="Available Timings" {...a11yProps(0)} />
                        <Tab label="Reviews and comments" {...a11yProps(1)} />
                     </Tabs>
                     </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            {
                              dateArray.length > 0 ? <SchedulingCard  {...schedulingCardProps} /> : <>
                                <Typography variant="h6" color="primary">
                                  Attention, wonderful patients!
                                </Typography>
                                <Typography variant="body1" color="textPrimary">
                                  We regret to inform you that the doctor hasn't added any new slots at the moment. We understand just how crucial it is for you to secure your appointments, and we sincerely apologize for any inconvenience this may cause.
                                </Typography>
                             </>
                            }            
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <Box>
                            <Stack sx={{
                              height: '20rem',
                              overflow: 'auto',
                              '&::-webkit-scrollbar': {
                                   width: '0.5rem', // Width of the scrollbar
                              },
                              '&::-webkit-scrollbar-track': {
                                  background: '#f1f1f1', // Background color of the track
                              },
                              '&::-webkit-scrollbar-thumb': {
                                  background: '#888', // Color of the thumb
                                  borderRadius: '0.25rem', // Border radius of the thumb
                              },
                              '&::-webkit-scrollbar-thumb:hover': {
                                  background: '#555', // Color of the thumb on hover
                              }
                            }}>
                               {
                                  doctor[0]?.comments.length > 0 ?  
                                  doctor[0]?.comments.map(item => {
                                    return (
                                        <>
                                            <Typography variant='h6'>
                                             {
                                                  item.user?.fullName
                                              }
                                            </Typography>
                                            <Typography
                                              sx={{color: 'gray'}}
                                              variant='subtitle'>
                                              {
                                                  item.comment
                                              }
                                            </Typography>
                                        </>
                                        
                                    )
                                  }) : <Typography>No reviews yet </Typography>
                              }
                            </Stack>
                            <Stack
                              direction='row'
                              sx={{ marginTop: '1.5rem' }}
                              position='relative'
                              component='form'
                              onSubmit={handleCommentSubmit}
                            >
                              <textarea
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    paddingRight: '2.5rem',
                                    outline: 'none',
                                    resize: 'none'  ,
                                    border: '.5px gray dotted',
                                    borderRadius: '.3rem'
                                 }}
                                value={comment}
                                onChange={handleCommentChange}
                              >
                              </textarea>
                              <Button
                                type='submit'
                                style={{
                                    position: 'absolute',
                                    top: '52%',
                                    right: '0.5rem',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer'
                                }}
                              >
                              <SendIcon
                                sx={{ color: '#8fe876' }} 
                              />
                              </Button>
                        
                              
                            </Stack>
                            </Box>
                        </TabPanel>
                    </SwipeableViews>
                    </Box>

                    {
                       selectedSlotId && <ColorButton
                           onClick={() => {
                              localStorage.setItem('bookedSlot', JSON.stringify(appointmentDetails))
                              dispatch(saveSelectedSlot());
                              navigate(`/doctor/${id}/checkout`)
                           } 
                          }
                          sx={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1.2rem'
                           }}>
                            Proceed to Pay
                        </ColorButton>
                    }

                    

            </Box> 
                

        </Stack>    
        <Toast
          setShowAlert={setShowAlert}
          showAlert={showAlert}
          message={alertMessage}
          severity = {severity}
        >
        </Toast>
      </>
    )
}

export default SlotBooking