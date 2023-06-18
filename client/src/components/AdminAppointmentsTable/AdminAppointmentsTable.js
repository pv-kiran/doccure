import React, { useEffect } from 'react';
import Box  from '@mui/material/Box';
import { adminGetAppoinments } from '../../app/features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../api/axiosInstance';
import Datatable from '../DataTable/Datatable';




function AdminAppointmentsTable() {

            const dispatch = useDispatch();

            const adminState = useSelector((state) => {
              return state.admin.user
            })

            useEffect(() => {
                  let user = JSON.parse(localStorage.getItem('user')) ;
                  instance.defaults.headers.common = {
                      Authorization : `Bearer ${user.token}`
                  }
            }, [])

  
            useEffect(() => {
                  dispatch(adminGetAppoinments());
            }, [])
  
            const filterList = (status) => {
                dispatch(adminGetAppoinments(status))
            }

            console.log(adminState?.appointments);
              const headCells = [
                {
                  id: 'doctor',
                  numeric: false,
                  disablePadding: true,
                  label: 'Doctor',
                },
                {
                  id: 'patient',
                  numeric: false,
                  disablePadding: true,
                  label: 'Patient',
                },
                {
                  id: 'date',
                  numeric: false,
                  disablePadding: true,
                  label: 'Date'
                },
                {
                  id: 'fee',
                  numeric: false,
                  disablePadding: true,
                  label: 'Fees'
                } ,
                {
                  id: 'status',
                  numeric: false,
                  disablePadding: true,
                  label: 'Status',
                } 
            ];
  
            const tableContent = 'adminAppointment'
            const userRole = 'admin'     
            const rows = adminState?.appointments ? adminState?.appointments : [];

  
            const adminProps = {
                tableContent ,
                rows,
                headCells,
                heading: 'Appointment details',
                userRole,
                filterList
            }

            return (
               rows.length > 0 && <Datatable {...adminProps}></Datatable> 
            );
    }

export default AdminAppointmentsTable;
