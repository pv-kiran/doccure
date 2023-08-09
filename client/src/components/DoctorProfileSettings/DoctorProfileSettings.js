import React, { useState , useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import imageupload from '../../assets/imageupload.png';
import Fab from '@mui/material/Fab';
// import EditIcon from '@mui/icons-material/Edit';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import TextField from '@mui/material/TextField';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// import './DoctorOnboarding.css'

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import  FormHelperText  from '@mui/material/FormHelperText';

// import './UserOnboarding.css'
// import instance from '../../api/axiosInstance';
import './DoctorProfileSettings';

import {  useSelector } from 'react-redux';



import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import CircularProgress from '@mui/material/CircularProgress';
// import FormHelperText from "@mui/material/FormHelperText"

import Autocomplete from '@mui/material/Autocomplete';



import instance from '../../api/axiosInstance';


// import './UserOnboarding.css'


const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  marginTop: '-.5rem',
  marginBottom: '2.5rem',
  borderRadius: '5px',
  padding: '.8rem' ,
  color:'white' ,
  letterSpacing: '2px',
  width: '10rem' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
    }
}));



function DoctorProfileSettings({ role }) {

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])

    const [specialities, setSpecialites] = useState([])
  
    // profile photo upload logic
    const [file, setFile] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [certififcateLink, setCertififcateLink] = useState('');

    const fetchSpecialities = async () => {
        const { data } = await instance.get('doctor/specialities')
        setSpecialites(data.specialities);
    }
    
    useEffect(() => {
       fetchSpecialities();
    }, [])
  
  
    const fetchDetails = async () => {
        try {
          const { data } = await instance.get(`/doctor/profile`);
          setFields(data.doctor[0])
          setFile(data.doctor[0].profilePicture.secure_url)
          setCertififcateLink(data.doctor[0].certificate.secure_url)
          

        } catch (err) {
          console.log(err);
        }
    }
  
    useEffect(() => {
      fetchDetails();
    }, [])
  
  


    const [formData, setFormData] = useState({
        username: '',
        gender: '',
        qualification: '' ,
        phone: '+91',
        houseName: '',
        speciality: '' ,
        city: '',
        state: '',
    });
        
    const [formErrors, setFormErrors] = useState({})

        
    const validateForm = () => {
        const errors = {};
        if (!formData.username) {
            errors.username = 'Full name is required';
        } else if (!/^[a-z]+ [a-z]+$/i.test(formData.username)) {
            errors.username = 'Please enter your full name';
        }
        if (!formData.qualification) {
            errors.gender = 'Qualification is required';
        }
        if (!formData.gender) {
            errors.gender = 'Gender is required';
        }
        if (!formData.speciality) {
            errors.speciality = 'speciality is required';
        }
        if (!formData.qualification) {
            errors.qualification = 'Qualification is required';
        }
        if (!formData.phone) {
            errors.phone = 'Mobile number is required';
        } else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(formData.phone)) {
            errors.phone = 'Mobile number must be an Indian number';
        } else if (!formData.phone.startsWith('+91') && !/^\d{10}$/.test(formData.phone)) {
            errors.phone = 'Invalid mobile number';
        }
        if (!formData.houseName) {
            errors.houseName = 'Address is required';
        }
        if (!formData.city) {
            errors.city = 'City is required';
        }
        if (!formData.state) {
            errors.state = 'State is required';
        }
        return errors;
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
        setFormErrors((prev) => {
            return {
                ...prev , [name] : ''
            }
        })
    };

    // handling the services auto completing changes
    const handleServicesChange = (event, newValue) => {
         setFormData((prevState) => ({ ...prevState, services: newValue }));
    };


   
  

    const handleChange = (e) => {
        setProfilePic(e.target.files[0]);
        // for displaying the file
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    // certificate or pdf upload logic
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [certificate , setCertificate] = useState('')
    const handleUpload = (e) => {
        setCertificate(e.target.files[0])
        setUploadSuccess(true);
    }

    
    const handleSubmit = async (e) => {
      
        e.preventDefault();
        
        const errors = validateForm();

        if (Object.keys(errors).length === 0) {
          const form = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });
            if (profilePic) {
               form.append('profilePic', profilePic); 
            }
            if (certificate) {
              form.append('certificate', certificate);
            }
            
            try {
              const { data } = await instance.put('/doctor/profile/update', formData);
              console.log(data.user);
              setFields(data.user);
            } catch (err) {
              console.log(err);
            }

        } else {
          setFormErrors(errors);
        }

    }
  

    const setFields = (user) => {
      setFormData({
            username: user.fullName,
            gender: user.gender,
            qualification: user.qualification,
            phone: user.phone,
            houseName: user.address.houseName ,
            speciality: user.speciality ,
            city: user.address.city ,
            state: user.address.state ,
            services: user.services
      })
    }
    

    return (
        <Box sx={{ marginLeft:'-25rem'}}>
            <Box
                sx={{
                    height: '100vh',
                    backgroundColor: 'white',
                    padding: '2.5rem 1.5rem',
                    width: '100%',
                    margin: '1rem auto'
                }}
            >

                <Box sx={{
                    border: '1px gray dotted',
                    width: '10rem',
                    height: '10rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '1rem 0',
                    position: 'relative'
                }}>
                    <img
                      src={file ? file : imageupload}
                      alt="upload-img"
                      className={file ? 'profile-pic' : ''} 
                      
                    />  
                    {
                              !file && <Typography
                                      variant='subtitle2' 
                                      sx={{
                                          color: 'gray',
                                          marginTop: '5px'
                                      }}
                                      >
                                           Upload a photo
                                      </Typography>
                    }
                    
                    <label htmlFor="image-upload" className='file-upload'>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={(e) => {handleChange(e)}}
                                // onChange={handleUpload}
                            />
                        <Fab
                            color="primary"
                            aria-label="edit"
                            component="span"
                            sx={{
                                width: '2.2rem',
                                height: '2.2rem'
                            }}
                        >
                                <FileUploadOutlinedIcon/>
                        </Fab>
                    </label> 
                </Box>
                <Box
                    component="form"
                    onSubmit={(e) => handleSubmit(e)}
                    sx={{
                        marginTop: '2.5rem'
                    }}
                >
                    
                    {/* Certificate upload */}
                    <Box
                            sx={{
                                border: '1px dotted gray',
                                textAlign: 'center',
                                padding: '.3rem',
                                borderRadius: '0.2rem',
                                height: '5rem'
                            }}
                         >
                            <label htmlFor="upload-button">
                                {uploadSuccess ? (
                                <CheckCircleIcon fontSize="large" />
                                ) : (
                                <CloudUploadIcon fontSize="large" />
                                )}
                            </label>
                            <div>{uploadSuccess ? 'File uploaded successfully!' : 'Please upload your certificate here'}</div>
                            <input
                                id="upload-button"
                                type="file"
                                onChange={handleUpload}
                                style={{ display: 'none' }}
                            />
                    </Box>
                    
                    
                    {/* User name and Speciality */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between' ,
                            marginTop: '1.5rem'
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="Full Name"
                            variant="outlined"     
                            name='username'
                            value={formData.username}
                            autoComplete='off'
                            onChange={handleInputChange}
                            error={!!formErrors.username}
                            helperText={formErrors.username}
                            sx={{
                            width: '48%'    
                            }}    
                        />  
                        <FormControl
                            error={!!formErrors.speciality}
                            sx={{
                                width: '48%'
                            }}
                        >
                            <InputLabel id="speciality-label">Speciality</InputLabel>
                            <Select
                                labelId="speciality-label"
                                id="speciality"
                                label="Speciality"
                                variant="outlined" 
                                name="speciality"
                                value={formData.speciality || ''}
                                onChange={handleInputChange}
                            >
                                {/* <MenuItem value="">
                                <em>None</em>
                                </MenuItem> */}
                                {
                                   specialities.length >  0 && specialities.map((speciality) => (
                                        <MenuItem key={speciality._id} value={speciality._id}>
                                            {speciality.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                            {!!formErrors.speciality && (
                                <FormHelperText
                                    sx={{
                                        color: 'red'
                                    }}
                                >
                                    {formErrors.speciality}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Box>

                    {/* Qualification */}
                    <TextField
                        id="outlined-basic"
                        label="Qualification"
                        variant="outlined"     
                        name='qualification'
                        value={formData.qualification}
                        autoComplete='off'
                        onChange={handleInputChange}
                        error={!!formErrors.qualification}
                        helperText={formErrors.qualification}
                        fullWidth
                        sx={{marginTop: '1.5rem'}}
                    /> 
                    
                    {/* Services */}
                    <Autocomplete
                        multiple
                        freeSolo
                        sx={{
                            margin: '1rem 0'
                        }}
                        options={formData.services ? formData.services : []}
                        onChange={handleServicesChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Services" />
                        )}
                    />

                    {/* Gender and modile number */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between' ,
                            marginTop: '1.5rem'
                        }}
                    >
                        <FormControl
                            error={!!formErrors.gender}
                            sx={{
                                width: '48%'
                            }}
                        >
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                label="Gender"
                                variant="outlined" 
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                <MenuItem value={'male'}>Male</MenuItem>
                                <MenuItem value={'female'}>Female</MenuItem>
                                <MenuItem value={'other'}>Other</MenuItem>
                            </Select>
                            {!!formErrors.gender && (
                                <FormHelperText
                                    sx={{
                                        color: 'red'
                                    }}
                                >
                                    {formErrors.gender}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            id="outlined-basic"
                            label="Mobile number"
                            autoComplete="off"
                            name="phone"
                            onChange={handleInputChange}
                            error={!!formErrors.phone}
                            helperText={formErrors.phone}
                            variant="outlined"
                            sx={{
                                width: '48%',
                            }}
                            value={formData.phone}
                        />
                    </Box>
                    
                    {/* House name */}
                    <TextField
                        id="outlined-basic"
                        label="Enter address"
                        variant="outlined" 
                        name='houseName'
                        value={formData.houseName}
                        onChange={handleInputChange}
                        autoComplete='off'
                        error={!!formErrors.houseName}
                        helperText={formErrors.houseName}
                        fullWidth
                        sx={{
                            marginTop: '1.5rem'
                        }}

                    /> 

                    {/* City and state */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="City"
                            variant="outlined" 
                            name='city'
                            value={formData.city}
                            onChange={handleInputChange}
                            error={!!formErrors.city}
                            helperText={formErrors.city}
                            autoComplete='off'
                            fullWidth
                            sx={{
                                marginTop: '1.5rem',
                                width: '48%'
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="State"
                            variant="outlined" 
                            name='state'
                            value={formData.state}
                            onChange={handleInputChange}
                            error={!!formErrors.state}
                            helperText={formErrors.state}
                            autoComplete='off'
                            fullWidth
                            sx={{
                                marginTop: '1.5rem',
                                width: '48%'
                            }}
                        />
                        
                    </Box>
               
                    <Box sx={{
                      width: '100%',
                      height: '75vh',
                      marginBottom: '1rem'
                    }}>
                        <iframe
                          src={certififcateLink}
                          title='certificate'
                          frameborder="0"
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        >
                        </iframe>
                    </Box>
                    
                    <ColorButton type='submit'>
                        Save Changes
                        {/* {
                           ( doctorUpdateState.loading || patientUpdateState.loading ) && <CircularProgress
                                size={28}
                                sx={{
                                color: '#fff',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                            />
                        } */}
                    </ColorButton>
                </Box>
            </Box>
        </Box>
    )
}

export default DoctorProfileSettings



