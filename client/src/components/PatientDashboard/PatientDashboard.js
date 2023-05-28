import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';


import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';

import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import DashboardDrawer, { DrawerHeader } from '../DashboardDrawer/DashboardDrawer';
import DashboardContent from '../DashboardContent/DashboardContent';




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
    {
      navItem: 'Doctors',
      navLink: '/patient/dashboard'
    },
    {
      navItem: 'Appointments',
      navLink: '/patient/appointments'
    },
    {
      navItem: 'Notifications',
      navLink: '/patient/notifications'
    },
    {
      navItem: 'Messages',
      navLink: '/patient/messages'
    }
  ]
    



  const appBarProps = {
    page: 'patient',
    color: '#fff',
    // open ,
    bgColor: '#424e82',
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
