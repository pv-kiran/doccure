import React , {useEffect} from 'react';
import instance from '../../api/axiosInstance';
import { getAppointments, updateAppointmentList } from './../../app/features/doctor/doctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../DataTable/Datatable';



function DoctorAppointmentsTable() {

        const doctorState = useSelector((state) => {
             return state.doctor
        })

        const dispatch = useDispatch();

        useEffect(() => {
              let user = JSON.parse(localStorage.getItem('user')) ;
              instance.defaults.headers.common = {
                  Authorization : `Bearer ${user.token}`
              }
        }, [])

        useEffect(() => {
          dispatch(getAppointments());
        }, [])
  
  
        const filterList = (status) => {
          dispatch(getAppointments(status));
        }


        const rows = doctorState?.user ? doctorState?.user : [];

        // console.log(rows);
  
        const headCells = [
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
              label: 'Date',
            },
            {
              id: 'Time',
              numeric: false,
              disablePadding: true,
              label: 'Time'
            },
            {
              id: 'status',
              numeric: false,
              disablePadding: true,
              label: 'Status',
            } ,
            {
              id: 'action',
              numeric: false,
              disablePadding: true,
              label: 'Action',
            }
        ];
  

        const statusToggler = async (id) => {
          const { data }  = await instance.put(`/appointment/${id}/approve`);
          dispatch(updateAppointmentList(data.appointment));
        }

  

        const tableContent = 'appointment'
        const userRole = 'doctor'     
  
        const doctorProps = {
          tableContent ,
          rows,
          headCells,
          heading: 'My Appointments',
          userRole,
          statusToggler,
          filterList
        }

        return (
            <>
              {
                  rows.length > 0 && <DataTable {...doctorProps}></DataTable>
              }
            </>
        );
}

export default DoctorAppointmentsTable;
