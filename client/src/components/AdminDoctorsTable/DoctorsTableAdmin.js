import React, { useEffect, useState } from 'react';
import Datatable from '../DataTable/Datatable';
import { adminGetAllDoctors, approveDoctor, updateDoctors } from '../../app/features/admin/adminSlice';
import instance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../Shared/Toast';


function AdminDoctorsTable() {

  // console.log(getAllDoctors);

  const adminState = useSelector((state) => {
    return state.admin;
  });

  console.log(adminState);

  const dispatch = useDispatch();

  useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
    }
  }, [])

  useEffect(() => {
    console.log('Hello from admin doctor table')
      dispatch(adminGetAllDoctors());
  }, [])


  const filterList = (status) => {
     dispatch(adminGetAllDoctors(status));
  }

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  // approving or rejection of doctors
  const statusToggler = async (doctorId) => {
    try {
      let { data } = await instance.put(`admin/doctor/status/${doctorId}`);
      console.log(data);
      dispatch(updateDoctors(data.doctor))
      setShowAlert(true);
      setAlertMessage('Status of the doctor is updated');
    } catch (error) {
      setShowAlert(true);
      setAlertMessage('Something went wrong');
      setSeverity('error')
    }
  }


  const rows = adminState?.user?.doctors ? adminState?.user.doctors : [];
  const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email',
  },
  {
    id: 'sepeciality',
    numeric: false,
    disablePadding: true,
    label: 'Speciality'
  },
  {
    id: 'cerificate',
    numeric: false,
    disablePadding: false,
    label: 'Certificate',
  },
  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  ];

  const tableContent = 'user'
  const userRole = 'doctor'

  const adminProps = {
    tableContent ,
    rows,
    headCells,
    heading: 'Doctors List',
    statusToggler,
    userRole,
    filterList
  }
  
  return (
    <>
      {
         rows.length > 0 && <Datatable {...adminProps}></Datatable> 
      }
      <Toast
          setShowAlert={setShowAlert}
          showAlert={showAlert}
          message={alertMessage}
          severity = {severity}
      >
      </Toast>
   </>
  );
}

export default AdminDoctorsTable;
