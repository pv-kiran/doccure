import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import  Typography  from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button  from '@mui/material/Button';

import './HeroSection.css';
import bannerThree from '../../assets/banner@3x.png';
import { useMediaQuery , createTheme, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import instance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';


function HeroSection() {

  const theme = createTheme(); // Create an empty theme object
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));


  const [specialities, setSpecialites] = useState([])

  const fetchSpecialities = async () => {
        const { data } = await instance.get('doctor/specialities')
        setSpecialites(data.specialities);
  }

  const [selectedSpeciality, setSelectedSpeciality] = useState('');

  const handleInputChange = (e) => {
    setSelectedSpeciality(e.target.value);
  }

  const [searchText, setSearchText] = useState('');

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const navigate = useNavigate();
 
  const handleNavigate = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedSpeciality) {
      queryParams.append('speciality', selectedSpeciality);
    }
    if (searchText) {
      queryParams.append('doctorName', searchText);
    }
    navigate(`doctors/all?${queryParams.toString()}`);
  }
 
  useEffect(() => {
    fetchSpecialities()
  }, []);

  return (
    <Box
      sx={{
        marginTop: '5rem',
        position: 'relative',
        width: '100%'
      }}
    >
      <img className='banner-img' src={bannerThree} alt="banner" /> 
      <Stack
        sx={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%'
        }}
      >
        <Typography variant='h4'
          sx={{
            textAlign: 'center',
            fontFamily: 'roboto'
          }}
        >
          Search Doctor, Make an Appointment
        </Typography>
        <Typography variant='subtitle1'
          sx={{
             textAlign: 'center',
             color: 'gray',
            }}
        >
          Discover the best doctors, clinic & hospital the city nearest to you.
        </Typography>
        <Stack
          direction={isSmallScreen ? 'column' : 'row'} 
            spacing={2}
            alignItems="center"
            justifyContent="center"
            marginTop= "1.5rem"
            sx={{
              textAlign: 'center',
            }}
            onSubmit={handleNavigate}
            component= 'form'
         >
          <FormControl
              sx={{
                width: {lg: '25%' , md: '25%' , sm: '50%'}
              }}
          >
              <InputLabel sx={{marginTop:'-.3rem'}} id="speciality-label">Speciality</InputLabel>
                            <Select
                                labelId="speciality-label"
                                id="speciality"
                                label="Speciality"
                                variant="outlined" 
                                name="speciality"
                                value={selectedSpeciality}
                                onChange={handleInputChange}
                                sx={{height: '2.8rem'}}
                            >
                                {/* <MenuItem value="">
                                <em>None</em>
                                </MenuItem> */}
                                {
                                   specialities.length >  0 && specialities.map((speciality) => (
                                        <MenuItem key={speciality._id} value={speciality._id}>
                                            {speciality.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
            <TextField
                placeholder="Search doctors , specialites"
                variant="outlined"
                sx={{
                  width: {lg: '35%' , md: '35%' , sm: '50%'},
                  "& label": {
                    display: "none"
                  }
                }}
                inputProps={{
                  style: {
                    height: 12 // change this value as you want
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
            }}
                value={searchText}
                onChange={handleChange}
            />
            <Button
                sx={{
                  color: "white",
                  borderRadius: '.3rem',
                  height: '2.8rem',
                  marginTop : '.05rem' ,
                  // width : '1.8rem' ,
                  backgroundColor: "#0AE4B3",
                  width: {lg: '2rem' , md: '2rem' , sm: '25%'},
                  "&:hover": {
                    backgroundColor: "#2CE1FE"
                  }
                }}
                type='submit'
            >
                <SearchIcon />
            </Button>
      </Stack>
      </Stack>
      
      
    </Box>
    
    
  );
}

export default HeroSection;
