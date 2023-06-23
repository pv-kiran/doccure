import React, { useEffect, useState } from 'react'
import instance from '../../api/axiosInstance'
import  Box  from '@mui/material/Box';
import  Typography  from '@mui/material/Typography';
import  Stack  from '@mui/material/Stack';



function SpecialitySection() {

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
          <Typography variant='h4'>Clinic and Specialities</Typography>
          <Typography
              variant='subtitle1'
              color='gray'
              fontWeight='500'
              width='75%'
              textAlign= 'center'
          >
              Unveiling Diverse Specialties: Comprehensive, Expert Medical Care for Your Unique Health Needs
          </Typography>
          <Stack direction='row' width= '100%' spacing={6} sx={{marginTop: '3rem'}}>
          {
              specialities.length > 0 && 
                  specialities.map((item, index) => {
                      return (
                      <Box
                        key={index}      
                            sx={{
                                border: '1px white solid',
                                width: '10rem',
                                height: '10rem',
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