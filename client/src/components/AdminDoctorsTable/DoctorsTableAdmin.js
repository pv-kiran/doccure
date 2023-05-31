import React, { useEffect } from 'react';
import Datatable from '../DataTable/Datatable';
import { adminGetAllDoctors, approveDoctor, updateDoctors } from '../../app/features/admin/adminSlice';
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
    console.log('Hello from admin doctor table')
      dispatch(adminGetAllDoctors());
  }, [])


  // approving or rejection of doctors
  const statusToggler = async (doctorId) => {
    try {
      let { data } = await instance.put(`admin/doctor/status/${doctorId}`);
      console.log(data);
      dispatch(updateDoctors(data.doctor)) 
    } catch (error) {
      console.log(error)
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

  const adminProps = {
    tableContent ,
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
