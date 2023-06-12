import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../api/axiosInstance';
import { getPatientAppointments, updatePatientAppointmentList } from '../../app/features/patient/patientSlice';
import DataTable from '../DataTable/Datatable';


function PatientAppointmentTable() {

        const patientState = useSelector((state) => {
          return state.patient;
        })

        console.log(patientState?.user);

        const dispatch = useDispatch();

        useEffect(() => {
              let user = JSON.parse(localStorage.getItem('user')) ;
              instance.defaults.headers.common = {
                  Authorization : `Bearer ${user.token}`
              }
        }, [])

        useEffect(() => {
          dispatch(getPatientAppointments());
        } , [])

        const statusToggler = async (id) => {
          console.log(id);
          const { data }  = await instance.put(`/appointment/${id}/cancel`);
          console.log(data.appointment);
          dispatch(updatePatientAppointmentList(data.appointment));
        }

        const rows = patientState?.user ? patientState?.user : [];

        const headCells = [
            {
              id: 'doctor',
              numeric: false,
              disablePadding: true,
              label: 'Doctor',
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

        const tableContent = 'appointment'
        const userRole = 'patient'

        const patientProp = {
          tableContent ,
          rows,
          headCells,
          heading: 'My Appointments',
          userRole,
          statusToggler
        }

        return (
              <>
                  {
                      rows.length > 0 && <DataTable {...patientProp}></DataTable>
                  }
              </>
        )
  
}

export default PatientAppointmentTable