import React, { useEffect, useState } from 'react'

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import { Box } from '@mui/material';
import instance from '../../api/axiosInstance';
import { addSpecialaity, updateSpeciality } from '../../app/features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';



function SpecialityModal(props) {

    let specialities = useSelector((state) => {
        return state.admin?.user?.specialities;
    })
    console.log(specialities);

    const { specialityModelOpen, setspecialityModelOpen, id , setEditId } = props;

    const [uploadSuccess, setUploadSuccess] = useState(false);


    const [specialityImg, setSpecialityImg] = useState('');

    const dispatch = useDispatch();
  

    const handleUpload = (e) => {
        setSpecialityImg(e.target.files[0]);
        setUploadSuccess(true);
    }


    const handleSpecialityModalClose = () => {
      setspecialityModelOpen(false);
      setEditId(null);
      setFormData({name:'' , fees:''})
    };
  
    const [formData, setFormData] = useState({
        name: '',
        fees: '',
    });

    const [formErrors, setFormErrors] = useState({
        name: false,
        fees: false,
    });
  
  
  console.log(formData);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        setFormErrors((prevState) => ({
          ...prevState,
          [name]: false,
        }));
    };

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
     }
    }, [])
  
  
    // if(id) {
    //   const data = specialities?.find(item => item._id === id);
    //   if (data) {
    //       const result = {
    //         name: data.name,
    //         fees: data.fees
    //     };
    //     setFormData(result);
    //   }
    //   setId(null);
    // }
    useEffect(() => {
      if (id) {
        const data = specialities?.find((item) => item._id === id);
        if (data) {
          const result = {
            name: data.name,
            fees: data.fees,
          };
          setFormData(result);
        }
      }
    }, [id]);
    
      
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = {
            name: formData.name === '',
            fees: formData.fees === '',
        };
        setFormErrors(errors);

        if (!Object.values(errors).some((error) => error)) {
            const form = new FormData();
                 Object.entries(formData).forEach(([key, value]) => {
                 form.append(key, value);
            })
            
            if (specialityImg) {
                form.append('specialityImg', specialityImg);
            }

            if (id) {
              
                try {

                    let {data} = await instance.put(`/admin/edit/speciality/${id}`, form, {
                        headers: {
                        'Content-Type': 'multipart/form-data'
                        }
                    })
                    dispatch(updateSpeciality(data.specialities)) 
                  } catch (err) {
                    
                }
              
            } else {

                try {

                  let {data} = await instance.post('/admin/add/speciality', form, {
                      headers: {
                      'Content-Type': 'multipart/form-data'
                      }
                  })
                  dispatch(addSpecialaity(data.specialities)) 
                } catch (err) {
                  
                }

            }
          
            
            
            handleSpecialityModalClose();
            setSpecialityImg('');
        }
  };
  
    

    
  return (
      <Modal
          open={specialityModelOpen}
          onClose={handleSpecialityModalClose}>
          <Box
            component= "form"
            onSubmit={(e) => { handleSubmit(e)}}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
              width: '80%',
              maxWidth: '500px',
            }}
          >
          <Typography
            component= 'h3'
            sx={{
            textAlign: 'left',
            margin: 0,
            fontSize: '1.2rem'
          }}>
            Add Speciality
          </Typography>
          <TextField
                name="name"
                label="Speciality Name"
                fullWidth
                autoComplete='off'
                style={{ margin: '1rem 0' }}
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
                helperText={formErrors.name ? 'Speciality Name is required' : ''}
          />
          <TextField
                name="fees"
                label="Add fees"
                fullWidth
                style={{ margin: '1rem 0' }}
                value={formData.fees}
                onChange={handleInputChange}
                error={formErrors.fees}
                helperText={formErrors.fees ? 'Fees are required' : ''}
          />
           {
              !id &&  <Box
              style={{
                border: '1px dotted gray',
                textAlign: 'center',
                padding: '.3rem',
                borderRadius: '0.2rem',
              }}
            >
              <label htmlFor="upload-button">
                {uploadSuccess ? (
                  <CheckCircleIcon fontSize="large" />
                ) : (
                  <CloudUploadIcon fontSize="large" />
                )}
              </label>
              <div>{uploadSuccess ? 'File uploaded successfully!' : 'Please upload a file'}</div>
              <input
                id="upload-button"
                type="file"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
            </Box>
           }
            <Button
            //   onClick={handleSpecialityModalClose}
              variant="contained"
              fullWidth
              type='submit'
              sx={{
                marginTop: '1rem',
                backgroundColor: '#424E82',
                color: '#fff'
              }}
            >
              Save Changes
            </Button>
          </Box>
      </Modal>
  )
}

export default SpecialityModal