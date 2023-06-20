import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';


import CssBaseline from '@mui/material/CssBaseline';

import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import DashboardDrawer from '../DashboardDrawer/DashboardDrawer';
import DashboardContent from '../DashboardContent/DashboardContent';


import LockClockIcon from '@mui/icons-material/LockClock';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import MessageIcon from '@mui/icons-material/Message';
import MedicationIcon from '@mui/icons-material/Medication';



function PatientDashboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen((prev) => {
      return !prev
    });
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
    
    const navigationLinks = [
    // {
    //   navItem: 'Doctors',
    //   navLink: '/patient/dashboard',
    //   icon: <MedicationIcon sx={{color: '#579ab5'}}/>
    // },
    {
      navItem: 'Appointments',
      navLink: '/patient/appointments' ,
      icon: <LockClockIcon sx={{color: '#579ab5'}}/>

    },
    {
      navItem: 'Notifications',
      navLink: '/patient/notifications',
      icon: <CircleNotificationsIcon sx={{color: '#579ab5'}}/>
    },
    {
      navItem: 'Messages',
      navLink: '/patient/messages' ,
      icon: <MessageIcon sx={{color: '#579ab5'}}/>

    }
  ]
    



  const appBarProps = {
    page: 'patient',
    color: '#fff',
    // open ,
    bgColor: '#496b78',
    handleDrawerOpen,
    setOpen,
  }

  const drawerProps = {
    open,
    theme,
    handleDrawerClose,
    setOpen,
    navigationLinks
    
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar {...appBarProps}></Navbar>
      <DashboardDrawer { ...drawerProps }></DashboardDrawer>
      <DashboardContent></DashboardContent>
    </Box>
  );
}


export default PatientDashboard
