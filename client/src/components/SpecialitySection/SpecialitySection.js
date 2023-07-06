import React, { useEffect, useState } from 'react'
import instance from '../../api/axiosInstance'
import  Box  from '@mui/material/Box';
import  Typography  from '@mui/material/Typography';
import  Stack  from '@mui/material/Stack';

import { useMediaQuery , createTheme} from '@mui/material';


function SpecialitySection() {
    const theme = createTheme(); // Create an empty theme object
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [specialities, setSpecialities] = useState([]);  

    useEffect(() => {
        const fetchSpeciality = async () => {
            try {
                const { data } = await instance.get('/doctor/specialities');
                setSpecialities(data?.specialities);
            } catch (err) {
                console.log(err);
            }
        }
        fetchSpeciality();
    } , [])
    

  return (
      <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '80%',
          margin: 'auto',
          padding: '6rem 1rem',
      }}>
          <Typography
              variant='h4'
              sx={{
                width: {lg: '75%' , md: '75%' , sm:'100%'},
                textAlign: 'center',
              }}
          >
              Clinic and Specialities
          </Typography>
          <Typography
              variant='subtitle1'
              color='gray'
              fontWeight='500' 
              sx={{
                width: {lg: '75%' , md: '75%' , sm:'100%'},
                  textAlign: 'center',
              }}
          >
              Unveiling Diverse Specialties: Comprehensive, Expert Medical Care for Your Unique Health Needs
          </Typography>
          <Stack direction='row' width= '100%' spacing={isSmallScreen ? 4 : 8} sx={{marginTop: '3rem'}}>
          {
              specialities.length > 0 && 
                  specialities.map((item, index) => {
                      return (
                      <Box
                        key={index}      
                            sx={{
                                border: '1px white solid',
                                width: {lg:'10rem' , md: '8rem' , sm:'5rem' , xs:'4rem'},
                                height: {lg:'10rem' , md: '8rem' , sm:'5rem' , xs: '4rem'},
                                borderRadius: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '.1rem .1rem .4rem rgba(.3,.3,.3,.3)'
                            }}
                      >
                        <img style={{ width: '30%', height: '30%' }} src={item?.specialityImg?.secure_url} alt="speciality">    
                        </img>
                     </Box> 
                     )
                    
                })
              }
              </Stack>
      </Box>
  )
}

export default SpecialitySection