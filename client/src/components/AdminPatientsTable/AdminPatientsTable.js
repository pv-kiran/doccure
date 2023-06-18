import React, { useEffect } from 'react';
import Datatable from '../DataTable/Datatable';
import { adminGetAllPatients, updatePatients } from '../../app/features/admin/adminSlice';
import instance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';


function AdminPatientsTable() {


  const adminState = useSelector((state) => {
    return state.admin;
  });


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
      console.log(data.patient);
      dispatch(updatePatients(data.patient))
    } catch (error) {
      
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

  console.log(rows);

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
   </>
    
  );
}

export default AdminPatientsTable;
