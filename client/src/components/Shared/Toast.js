import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Toast({ showAlert , setShowAlert  , message , severity}) {
  const handleAlertClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setShowAlert(false);
  };
  return (
    <Snackbar open={showAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                  <Alert onClose={handleAlertClose} severity= {severity}>
                    {
                     message
                    }
                  </Alert>
    </Snackbar>
  )
}

export default Toast