import React, { useEffect, useState } from 'react';
import Datatable from '../DataTable/Datatable';
import { adminGetAllPatients, updatePatients } from '../../app/features/admin/adminSlice';
import instance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../Shared/Toast';


function AdminPatientsTable() {


  const adminState = useSelector((state) => {
    return state.admin;
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const dispatch = useDispatch();

  useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
    }
  }, [])

  useEffect(() => {
       dispatch(adminGetAllPatients()); 
  }, [])

  const filterList = (status) => {
      dispatch(adminGetAllPatients(status))
  }


  const statusToggler = async (patientId) => {
    try {
      let {data} = await instance.put(`admin/patient/status/${patientId}`);
      dispatch(updatePatients(data.patient))
      setShowAlert(true);
      setAlertMessage('Status of the Patient is updated');
    } catch (error) {
      setShowAlert(true);
      setAlertMessage('Something went wrong');
      setSeverity('error')
    }
  }
  
  const rows = adminState?.user?.patients ? adminState?.user.patients : [];
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
    id: 'phone',
    numeric: false,
    disablePadding: true,
    label: 'Mobile'
  },
  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  ];


  const tableContent = 'user'
  const userRole =  'patient'

  const adminProps = {
    tableContent,
    rows,
    headCells,
    heading: 'Patients List',
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

export default AdminPatientsTable;
