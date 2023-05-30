import React, { useEffect } from 'react';
import Datatable from '../DataTable/Datatable';
import { adminGetAllDoctors, approveDoctor } from '../../app/features/admin/adminSlice';
import instance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';




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
    console.log('Hi ,,, Testing')
    dispatch(adminGetAllDoctors());
  }, [adminState.actionSuccess])


  // approving or rejection of doctors
  const statusToggler = (doctorId) => {
    dispatch(approveDoctor(doctorId))
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

  const adminProps = {
    rows,
    headCells,
    heading: 'Doctors List',
    statusToggler
  }
  
  return (
    <>
      {
         rows.length > 0 && <Datatable {...adminProps}></Datatable> 
      }
   </>
  );
}

export default AdminDoctorsTable;
