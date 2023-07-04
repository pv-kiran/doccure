import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';


function NotFoundPage() {
  return (
    <Box className="not-found-page">
      <Typography variant='h3'>Oops! Page not found.</Typography>
      <Typography variant='subtitle1'>The page you are looking for does not exist.</Typography>
      <Link to="/" className="home-link">
        Go back to Home
      </Link>
    </Box>
  )
}

export default NotFoundPage