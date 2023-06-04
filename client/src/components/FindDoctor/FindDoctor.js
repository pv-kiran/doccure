import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import './FindDoctor.css';



import doctor from '../../assets/doctor.jpg';
import pharmacy from '../../assets/pharmacy.jpg';
import lab from '../../assets/lab.jpg';
import { useNavigate } from 'react-router-dom';


function FindDoctor() {

  const navigate = useNavigate();

  return (
    <Box sx={{ padding: '1.5rem' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontFamily: 'robot'
        }}
      >
        What are you looking for?
      </Typography>
      <Stack
        direction="row"
        spacing={6}
        justifyContent="center"
        sx={{
          padding: '3rem'
        }}
      >
        <Box
          sx={{
            width: '17.5rem',
            height: '12rem',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '.5rem',
            cursor: 'pointer',
            '&:hover img': {
              transform: 'scale(1.2)'
            }
            
          }}
        >
          <img
            className='image-container'
            src={doctor}
            alt="findDr"
          />
          <div
            className='overlay'
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ color: '#fff', letterSpacing: '.2rem' ,marginBottom: '1rem' }}
            >
              Visit a doctor
            </Typography>
            <Button
               sx={{
                    backgroundColor: '#0defff',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: '#24b3bd'
                    }
              }}
              onClick={() => {
                navigate('/doctors/all')
              }}
            >
              Book Now
            </Button>
          </div>
        </Box>
        <Box
          sx={{
            width: '17.5rem',
            height: '12rem',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '.5rem',
            cursor: 'pointer',
            '&:hover img': {
              transform: 'scale(1.2)'
            }
            
          }}
        >
          <img
            className='image-container'
            src={lab}
            alt="findDr"
          />
          <div
            className='overlay'
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ color: '#fff', letterSpacing: '.2rem' ,marginBottom: '1rem' }}
            >
              Find a pharmacy
            </Typography>
            <Button
               sx={{
                    backgroundColor: '#0defff',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: '#24b3bd'
                    }
               }}         
            >
              Coming soon
            </Button>
          </div>
        </Box>
        <Box
          sx={{
            width: '17.5rem',
            height: '12rem',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '.5rem',
            cursor: 'pointer',
            '&:hover img': {
              transform: 'scale(1.2)'
            }
            
          }}
        >
          <img
            className='image-container'
            src={pharmacy}
            alt="findDr"
          />
          <div
            className='overlay'
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ color: '#fff', letterSpacing: '.2rem' ,marginBottom: '1rem' }}
            >
               Find a lab
            </Typography>
            <Button
               sx={{
                    backgroundColor: '#0defff',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: '#24b3bd'
                    }
               }}         
            >
              Coming soon
            </Button>
          </div>
        </Box>
      </Stack>
    </Box>
  );
}

export default FindDoctor;
