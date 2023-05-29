import React, { useState } from "react";
import { Modal, Button, Checkbox, FormControlLabel } from "@mui/material";

import './Modal.css'



const ConfirmModal = ({ open, onClose, onConfirm }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
        <Modal open={open} onClose={onClose} centered={true}> 
            <div className="modal-container">
            <h2>Confirm Action</h2>
              <p>
                  This will toggle the user's access to the app and notifications.
              </p>
              <FormControlLabel
                sx={{
                      marginTop: '-1rem',
                      marginBottom: '2rem',
                      marginLeft: '1rem'
                }}
                control={
                <Checkbox
                checked={checked}
                onChange={handleChange}
                name="notify"
                color="primary"
                />
                }
            label="Are you sure to continue ?"
            />
            <div className="actions"> 
                  <Button
                      onClick={onClose}
                      color="primary"
                      variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => onConfirm(checked)}
                      variant="contained"
                      sx={{
                          backgroundColor: '#424E82'
                      }}
                  >
                     Confirm
            </Button>
            </div>
            </div>
        </Modal>
  );
};

export default ConfirmModal;
