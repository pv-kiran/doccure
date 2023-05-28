import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import  Typography  from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
// import IconButton from "@mui/material/IconButton";
import Button  from '@mui/material/Button';


import './HeroSection.css';
import banner from '../../assets/banner.png';
import bannertwo from '../../assets/banner@2x.png'
import bannerThree from '../../assets/banner@3x.png';


function HeroSection() {
  return (
    <Box
      sx={{
        marginTop: '5rem',
        position: 'relative'
      }}
    >
      <img className='banner-img' src={bannerThree} alt="banner" /> 
      <Stack
        // spacing={1}
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
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            marginTop= "1.5rem"
            sx={{
              textAlign: 'center'
            }}
         >
            <TextField
              placeholder="Location"
              variant="outlined"
              // size='small'
                sx={{
                  "& label": {
                    display: "none"
                  } ,
              }}
              inputProps={{
                  style: {
                    height: 12
                  }
              }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{
                      marginLeft: '-.5rem'
                    }}>
                      <LocationOnIcon />
                    </InputAdornment>
                  )
                }}
            />
            <TextField
                placeholder="Search doctors , specialites"
                variant="outlined"
                sx={{
                  width: '35%',
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
            />
            <Button
                sx={{
                  color: "white",
                  borderRadius: '.3rem',
                  height: '2.8rem',
                  marginTop : '.05rem' ,
                  width : '1.8rem' ,
                  backgroundColor: "#0AE4B3",
                  "&:hover": {
                    backgroundColor: "#2CE1FE"
                  }
                }}
            >
                <SearchIcon />
            </Button>
      </Stack>
      </Stack>
      
      
    </Box>
    
    
  );
}

export default HeroSection;
