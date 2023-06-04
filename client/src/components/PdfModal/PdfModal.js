import React from 'react';
import Modal from '@mui/material/Modal';
import  Box  from '@mui/material/Box';



const PdfModal = ({ isOpen , closeModal , pdfLink }) => {
  

  return (
    <>
      <Modal open={isOpen} onClose={closeModal}>
        <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '85%',
          height: '85%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          // p: 4,
        }}
      >
        <Box
          component="iframe"
          src={pdfLink}
          title="PDF"
          sx={{
            width: '100%',
            height: '100%',
            border: 'none',
            '&::-webkit-scrollbar': {
              width: '10px',
              backgroundColor: '#F5F5F5',
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '10px',
              backgroundColor: '#9E9E9E',
            }
          }}
        />
      </Box>
      </Modal>
    </>
  );
};

export default PdfModal
