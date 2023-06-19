import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import instance from '../../api/axiosInstance';
import  Typography  from '@mui/material/Typography';

import MedicationIcon from '@mui/icons-material/Medication';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';

function AdminCharts() {

  const [detailsCount, setDetaisCount] = useState([]);

  useEffect(() => {
      let user = JSON.parse(localStorage.getItem('user')) ;
           instance.defaults.headers.common = {
           Authorization : `Bearer ${user.token}`
      }
  }, [])

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      const { data }  = await instance.get('/admin/get/dashboard');
      console.log(data.count)
      setDetaisCount(data.count);
    }
    
    fetchDashboardDetails();

  } , [])

  return (
    <Stack
      direction='row' 
      spacing={10}
      sx={{
          width: {lg: '100%' , md: '100%', sm : '100%' , xs: '17.5rem'} ,
          marginTop: '4rem',
          marginLeft: { lg: '-4rem', md: '1rem', sm: '4rem', xs: '.5rem' },
          '& > :not(style)': {
          width: '10rem',
          height: '5rem',
        }
    }}>
      {
        detailsCount.length > 0 && detailsCount.map((count, index) => {
            let icon;
            if (Object.keys(count)[0] === 'doctors') {
              icon =  <MedicationIcon/>
            }
            if (Object.keys(count)[0] === 'pateints') {
                icon =  <EscalatorWarningIcon/>
            }
            if (Object.keys(count)[0] === 'specialities') {
                icon =  <FolderSpecialIcon/>
            }
            if (Object.keys(count)[0] === 'appointments') {
              icon = <ScheduleIcon/>
            }
           return (
             <Paper key={index} sx={{
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               alignItems: 'center'
             }}>
               {
                  icon
               }
               <Typography sx={{
                 textTransform: 'capitalize',
                 fontSize: '1.2rem'
               }}>
                 {Object.keys(count)[0]}
               </Typography>
               <Typography sx={{fontSize: '1.2rem'}}>
                 {Object.values(count)[0]}
               </Typography>
            </Paper>
           )
        })
      }
      
    </Stack>
  );
}

export default AdminCharts;
