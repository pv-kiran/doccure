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


import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDateId } from '../../app/features/appointment/appointmentSlice';



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
 
    const [doctor, setDoctors] = useState([]);

    const appointmentState = useSelector((state) => {
        return state.appointment
    })

  const {selectedDateId ,  selectedSlotId , startTime , endTime } = appointmentState;
  

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
  
    const dispatch = useDispatch();
    

    let dateArray = [];
    console.log(doctor[0]?.availableSlots);

    if (doctor[0]?.availableSlots) {
        dateArray = doctor[0].availableSlots?.map(slot => {
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
           dispatch(setSelectedDateId(dateArray[0]._id));
           setSelectedId(dateArray[0]._id);
        }
    }, [dateArray.length]);

    const onClickDate = (_id) => {
        console.log(_id);
        setSelectedId(_id);
        dispatch(setSelectedDateId(_id));
    };


  const dateSlotes = doctor[0]?.availableSlots?.filter(data => data._id === selectedId) || [];

    console.log(selectedId);
    console.log(dateSlotes);


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
            endTime : endTime
    }
  
 


    // console.log(id);
    return (
      <>
        <Navbar {...navBarProps}></Navbar>  
        <Stack direction= 'row'>
            <Box sx={{
                    marginTop: '4rem',
                    height: '50vh',
                    padding: '2rem 1rem',
                    width: '30%'
            }}>
                {
                        doctor.length > 0  && doctor.map((doctor) => 
                            <DoctorVerticalCard key={doctor._id} doctor={doctor}/>
                        )
                }       
            </Box>
            <Box sx={{
                    width: '65%',
                    height: '81vh' ,
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
                              dateArray.length > 0 && <SchedulingCard  {...schedulingCardProps} />
                            }            
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          Item Two
                        </TabPanel>
                    </SwipeableViews>
                    </Box>

                    {
                       selectedSlotId && <ColorButton
                           onClick={() => {
                              console.log(appointmentDetails);
                              localStorage.setItem('bookedSlot' , JSON.stringify(appointmentDetails))
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
            
      </>
    )
}

export default SlotBooking