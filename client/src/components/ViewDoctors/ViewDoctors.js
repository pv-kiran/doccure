import React, { useState, forwardRef , useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRange as DateRangeIcon } from '@mui/icons-material';
import './VisitDoctors.css';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


// import LocationOnIcon from '@mui/icons-material/LocationOn';

// import img from '../../assets/doctor.jpg';
import instance from '../../api/axiosInstance';
import Navbar from '../Navbar/Navbar';
import DoctorCard from '../DoctorCard/DoctorCard';




const theme = createTheme({
  overrides: {
    MuiInputBase: {
      input: {
        background: '#6a7073',
        borderRadius: '4px',
        padding: '8px',
        border: 'none',
      },
    },
    MuiButton: {
      root: {
        backgroundColor: '#6a7073',
        color: 'inherit',
        minWidth: 'initial',
        padding: '8px',
        borderRadius: '4px',
      },
    },
  },
});

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2CE1FE',
  fontsize: '2rem',
//   marginTop: '-3rem',
  borderRadius: '5px',
  padding: '.4rem .8rem',
  width: '100%',
  position:'relative' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
      backgroundColor: '#0AE4B3',
      
  }
}));

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button ref={ref} className="myDatePicker" onClick={onClick}>
    <span className="dateText">{value ? value.toString() : 'Select a date'}</span>
    <DateRangeIcon className="dateIcon" />
  </button>
));

function ViewDoctors() {

  // rating

  // date picker
  const [startDate, setStartDate] = useState(null);
    
  // filtering  - based on the gender
  const [gender, setGender] = useState({ male: false, female: false });
  const handleGenderChange = (event) => {
    setGender({ ...gender, [event.target.name]: event.target.checked });
  };

  // filtering - based on the specialites
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);

    const handleSpecialityChange = (specialityId) => {
    setSelectedSpecialities((prevSelectedSpecialities) => {
      if (prevSelectedSpecialities.includes(specialityId)) {
        return prevSelectedSpecialities.filter((id) => id !== specialityId);
      } else {
        return [...prevSelectedSpecialities, specialityId];
      }
    });
    };

 
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const {data} = await instance.get('patient/doctors/all') 
        console.log(data);
        setDoctors(data.doctors);
      } catch (error) {
        console.error('Error fetching Doctors:', error);
      }
    };

    fetchDoctors();
  }, []);



  // sidebar speciality logic
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const {data} = await instance.get('doctor/specialities') 
        console.log(data);
        setSpecialities(data.specialities);
      } catch (error) {
        console.error('Error fetching specialities:', error);
      }
    };

    fetchSpecialities();
  }, []);


  

  const navBarProps = {
    page: 'home',
    bgColor: '#fff',
    color: 'green'
  }

  return (
    <>
      <Navbar {...navBarProps}></Navbar>
       <Stack sx={{marginTop: '5rem'}} direction="row" spacing={3} padding="2rem">
            <Box className="sidebar"
                    sx={{
                        border: '1px gray dotted',
                        borderRadius: '.2rem',
                        width: '25%',
                        height: '92vh',
                        position: 'sticky',
                        top: '.8rem'
                    }}>
              <List component="nav" aria-label="mailbox folders">
                <ListItem>
                  <ListItemText primary="Filter Doctors" />
                </ListItem> 
                <Divider /> 
                <ListItem sx={{ marginTop: '2rem' }}>
                  <ThemeProvider theme={theme}>
                    <DatePicker
                      customInput={<CustomInput />}
                      className="myDatePicker"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </ThemeProvider>
                </ListItem>
                <ListItem
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText primary="Gender" color="blue" />
                  <Stack direction="column">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.male}
                          onChange={handleGenderChange}
                          name="male"
                        />
                      }
                      label="Male Doctor"
                      sx={{ ml: '0.5rem',mb: '-.5rem' , color: '#6a7073' }} // Adjusted margin-left value
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={gender.female}
                          onChange={handleGenderChange}
                          name="female"
                        />
                      }
                      label="Female Doctor"
                      sx={{ ml: '0.5rem',mb: '-.5rem' , color: '#6a7073' }} // Adjusted margin-left value
                    />
                  </Stack>
                  </ListItem>
                <ListItem
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                <ListItemText primary="Speciality" />
                  <Stack direction="column">
                    
                    {specialities.length > 0 && specialities.map((item) => (
                      <FormControlLabel
                        key={item._id}
                        control={
                          <Checkbox
                            checked={selectedSpecialities.includes(item._id)}
                            onChange={() => handleSpecialityChange(item._id)}
                            name={item._id}
                          />
                        }
                        label={item.name}
                        sx={{ ml: '0.5rem', mb: '-.5rem', color: '#6a7073' }}
                      />
                      ))
                    }

                  </Stack>
                </ListItem>  
                <ListItem>
                  <ColorButton>Search</ColorButton>                    
                </ListItem>                  
                      
              </List>
            </Box>
            <Box
              className="doctorsList"
              sx={{
                  width: '75%',
              }}>
              {
                doctors.length > 0 && doctors.map((doctor) => 
                    <DoctorCard key={doctor._id} doctor={doctor}></DoctorCard>
                )
              }
            </Box>
       </Stack> 
     </>
  );
}

export default ViewDoctors;
