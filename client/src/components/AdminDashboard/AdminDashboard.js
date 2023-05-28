import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';


import CssBaseline from '@mui/material/CssBaseline';

import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import DashboardDrawer from '../DashboardDrawer/DashboardDrawer';
import DashboardContent from '../DashboardContent/DashboardContent';




function AdminDashboard() {
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


  const appBarProps = {
    page: 'admin',
    color: '#fff',
    // open ,
    bgColor: '#424e82',
    handleDrawerOpen,
    setOpen,
  }

  const navigationLinks = [
    {
      navItem: 'Dashboard',
      navLink: '/admin/dashboard'
    },
    {
      navItem: 'Doctors',
      navLink: '/admin/doctors'
    },
    {
      navItem: 'Patients',
      navLink: '/admin/patients'
    },
    {
      navItem: 'Appointments',
      navLink: '/admin/appointments'
    },
    {
      navItem: 'Specialities',
      navLink: '/admin/specialities'
    } ,
    {
      navItem: 'Transactions',
      navLink: '/admin/transactions'
    }
  ]

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


export default AdminDashboard
