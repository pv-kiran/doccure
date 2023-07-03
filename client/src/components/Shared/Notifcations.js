import React, { useEffect, useState } from 'react'
import  Box  from '@mui/material/Box';
import instance from '../../api/axiosInstance';
import { Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


function Notifications() {

  const [notification, setNotification] = useState([])  
    
  console.log(notification);

  useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])

  const readNotification = async () => {
    const { data } = await instance.put(`/notification/mark-read`);
    setNotification(data.notification)
  }

  useEffect(() => {
    readNotification();
  }, [])
    

    
    
    
return (
      
    <Box sx={{ marginTop: '5rem' , border: '1px red solid' , marginLeft: '-30rem' }}>
        {
            notification.length === 0 ? <Typography>No New Notifications</Typography> :
                notification.map((notification) => {
                    const { recipientType } = notification;
                    let navLink;
                    if (recipientType === 'Doctor') {
                        navLink = '/doctor/appointments'
                    }
                    else if (recipientType === 'Patient') {
                        navLink = '/doctor/appointments'
                    }
                    else {
                        navLink = `/admin/${notification?.senderType.toLowerCase()}s`
                    }
                    return (
                        <Stack
                            key={notification._id}
                            sx={{
                                textDecoration: 'none'
                            }}
                            component={Link}
                            to={navLink}
                        >
                        {/* <img src={} alt="image-pro" /> */}
                        <Typography>{ notification.message}</Typography>
                        </Stack>
                    )
                })
       }
    </Box>
  )
}

export default Notifications
