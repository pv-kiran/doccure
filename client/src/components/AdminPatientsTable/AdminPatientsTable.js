import React, { useEffect } from 'react';
import Datatable from '../DataTable/Datatable';
import { adminGetAllPatients } from '../../app/features/admin/adminSlice';
import instance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';


function AdminPatientsTable() {

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
    // console.log(user);
  }, [])

  useEffect(() => {
    console.log('Hi ,,, Testing')
    dispatch(adminGetAllPatients());
  }, [])
  
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

  const adminProps = {
    rows,
    headCells,
    heading: 'Patients List'
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
