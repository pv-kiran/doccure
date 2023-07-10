import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import instance from '../../api/axiosInstance';
import { getPatientAppointments, updatePatientAppointmentList } from '../../app/features/patient/patientSlice';
import DataTable from '../DataTable/Datatable';
import Toast from '../Shared/Toast';

function PatientAppointmentTable() {

        const patientState = useSelector((state) => {
          return state.patient;
        })


        const dispatch = useDispatch();

        useEffect(() => {
              let user = JSON.parse(localStorage.getItem('user')) ;
              instance.defaults.headers.common = {
                  Authorization : `Bearer ${user.token}`
              }
        }, [])

        useEffect(() => {
          dispatch(getPatientAppointments());
        }, [])
  
        const [showAlert, setShowAlert] = useState(false);
        const [alertMessage, setAlertMessage] = useState('');
        const [severity, setSeverity] = useState('success');

        const statusToggler = async (id) => {
          const { data }  = await instance.put(`/appointment/${id}/cancel`);
          dispatch(updatePatientAppointmentList(data.appointment));
          setShowAlert(true);
          setSeverity('error');
          setAlertMessage('Appointment is cancelled');
        }
  

        const filterList = (status) => {
            dispatch(getPatientAppointments(status))
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
          statusToggler,
          filterList
        }

        return (
              <>
                  {
                      rows.length > 0  && <DataTable {...patientProp}></DataTable>
                  }
                  <Toast
                      setShowAlert={setShowAlert}
                      showAlert={showAlert}
                      message={alertMessage}
                      severity = {severity}
                  >
                  </Toast>
              </>
        )
  
}

export default PatientAppointmentTable