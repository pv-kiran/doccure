import React, { useState , useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {  createTheme, ThemeProvider } from '@mui/material/styles';
import 'react-datepicker/dist/react-datepicker.css';
import './VisitDoctors.css';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import instance from '../../api/axiosInstance';
import Navbar from '../Navbar/Navbar';
import DoctorCard from '../DoctorCard/DoctorCard';
import Radio  from '@mui/material/Radio';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMediaQuery } from '@mui/material';




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



function ViewDoctors() {

  const theme = createTheme(); // Create an empty theme object
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

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
  const [date, setValue] = useState();
    
  const [gender, setGender] = useState(''); 

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

 
  const [doctors, setDoctors] = useState([]);

  


  useEffect(() => {

    const fetchDoctors = async (skip , limit) => {
        try {
          const { data } = await instance.get(`patient/doctors/all?skip=${skip}&limit=${limit}`);
          setDoctors(data.doctors);
          // setDoctors(data.doctors);
        } catch (error) {
          console.error('Error fetching Doctors:', error);
        }
    };
    fetchDoctors(0, 2);
    
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

  const fetchMoreDoctors = async (skip, limit) => {

    const url = `patient/doctors/all?skip=${skip}&limit=${limit}${selectedSpecialities ? `&specialities=${selectedSpecialities}` : ''}${gender ? `&gender=${gender}` : ''}${date ? `&dates=${date}` : ''}`;

    try {
      const { data } = await instance.get(url);
      setDoctors(prevDocotors => [...prevDocotors , ...data.doctors]);
    } catch (error) {
          console.error('Error fetching Doctors:', error);
    }
    
  };

  const handleFetchMore = () => {
    const skip = doctors.length; // Calculate the number of items already fetched
    const limit = 3; // Assuming you want to fetch 10 more items
    fetchMoreDoctors(skip, limit);
  }


  const fetchDoctorsByFilteration = async (skip, limit) => {

    const url = `patient/doctors/all?skip=${skip}&limit=${limit}${selectedSpecialities ? `&specialities=${selectedSpecialities}` : ''}${gender ? `&gender=${gender}` : ''}${date ? `&dates=${date}` : ''}`;

    console.log(url);
    try {
      const { data } = await instance.get(url);
      setDoctors(data.doctors);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  

  const navBarProps = {
    page: 'home',
    bgColor: '#fff',
    color: 'green'
  }

  return (
    <>
      <Navbar {...navBarProps}></Navbar>
      <Stack
        sx={{ marginTop: '5rem' }}
        direction=  {isSmallScreen ? 'column' : 'row'}
        spacing={3}
        padding="2rem"
      >
            <Box className="sidebar"
                    sx={{
                        border: '1px gray dotted',
                        borderRadius: '.2rem',
                        width: {lg: '30%' , md: '25%' , sm: '100%' , xs:'100%'},
                        height: {xl: '92vh' , lg: '80vh'  , md: 'auto' , sm: 'auto' , xs: 'auto'},
                        position: {lg:'sticky' , md: 'sticky' , sm: 'relative' , xs: 'relative'},
                        top: '.8rem'
                    }}>
              <List component="nav" aria-label="mailbox folders">
                <ListItem>
                  <ListItemText primary="Filter Doctors" />
                </ListItem> 
                <Divider /> 
                <ListItem sx={{ marginTop: '2rem' }}>
                  <ThemeProvider theme={theme}>
                    
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']} sx={{overflow: 'hidden'}}>
                            <DatePicker
                              date={date}
                              onChange={(newValue) => {
                                setValue(newValue);
                              }}
                              disablePast
                              className="custom-date-picker"
                            />
                      </DemoContainer>
                    </LocalizationProvider>
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
                      <Stack direction="row">
                        <FormControlLabel
                          control={
                            <Radio
                              checked={gender === 'male'}
                              onChange={() => handleGenderChange('male')}
                              value="male"
                              name="gender"
                            />
                          }
                          label="Male"
                          sx={{ ml: '0.5rem', mb: '-.5rem', color: '#6a7073' }}
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              checked={gender === 'female'}
                              onChange={() => handleGenderChange('female')}
                              value="female"
                              name="gender"
                            />
                          }
                          label="Female"
                          sx={{ ml: '0.5rem', mb: '-.5rem', color: '#6a7073' }}
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
              <ColorButton
                onClick={() => {
                  console.log(selectedSpecialities);
                  fetchDoctorsByFilteration(0, 2);
                }}>
                Search
              </ColorButton>                    
                </ListItem>                  
                      
              </List>
            </Box>
            <Box
              className="doctorsList"
              sx={{
                  width: {lg: '70%' , md: '75%' , sx: '100%' , xs: '100%'},
              }}
            >
              {
                doctors.length > 0 && doctors.map((doctor) => 
                    <DoctorCard key={doctor._id} doctor={doctor}></DoctorCard>
                )
              }
              <ColorButton
                sx={{
                    width: {lg: '20%' , md: '20%' , sm: '100%' , xs: '100%'},
                    marginLeft: {lg: '45%' , md: '45%' , sm: '0' , xs:'0'}
                }}
                onClick={() =>  handleFetchMore()}
              >
                 Load more
              </ColorButton> 
           </Box>
       </Stack> 
     </>
  );
}

export default ViewDoctors;
