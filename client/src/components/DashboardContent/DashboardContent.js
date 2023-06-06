import React from 'react';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
import { DrawerHeader } from '../DashboardDrawer/DashboardDrawer';
import { Outlet } from 'react-router-dom';




function DashboardContent() {
  return (
    <Box component="main" sx={{
        flexGrow: 1,
        // p: 3,
        padding: '2rem 0',
      }}>
          {/* <DrawerHeader /> */}
          <Outlet></Outlet>
      </Box>
  );
}

export default DashboardContent;
