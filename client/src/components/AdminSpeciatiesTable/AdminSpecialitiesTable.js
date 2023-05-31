import React from 'react';
import DataTable from '../DataTable/Datatable';
import instance from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {  adminGetSpecialities, updateSpeciality} from '../../app/features/admin/adminSlice';


function AdminSpecialitiesTable() {

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
      dispatch(adminGetSpecialities());
  } , [])

  const rows = adminState?.user?.specialities ? adminState?.user.specialities : [];


  const statusToggler = async (id) => {
    try {
    let {data} = await instance.put(`admin/speciality/status/${id}`);
      dispatch(updateSpeciality(data.specialities)) 
    } catch (error) {
      console.log(error)
    }
  }


  const headCells = [
      {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Speciality',
      },
      {
        id: 'fees',
        numeric: false,
        disablePadding: true ,
        label: 'Fees',
      },
      {
        id: 'status',
        numeric: false,
        disablePadding: true,
        label: 'Status',
      },
      {
        id: 'edit',
        numeric: true,
        disablePadding: false,
        label: 'Edit',
      }  ,
      {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Actions',
      },
      
  ];

  const tableContent = 'speciality'

  const adminProps = {
    tableContent,
    rows,
    headCells,
    heading: 'Speciality List',
    statusToggler
  }




  return (
    <>
      
      {
         <DataTable {...adminProps}></DataTable>
      }
      
    </>
    
  );
}

export default AdminSpecialitiesTable;
