/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import patientService from '../../../appwrite/patient.service';
import doctorService from "../../../appwrite/doctor.service";
import appointmentService from "../../../appwrite/appointment.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from '../../../store/pageSwitchSlice';
import { Query } from 'appwrite';
import { PRDataTable, PRAutoComplete, Button } from '../../index';
import { notify, confirm } from "../../../shared/Utility";

const ManageAppointment = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);

    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(undefined);

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);

    const cols = [
        { field: '$id', header: 'Id', dataType: DataType.string, isSelected: false },
        { field: 'Patients.Name', header: 'Patient', dataType: DataType.string, isSelected: true },
        { field: 'Doctors.Name', header: 'Doctor', dataType: DataType.string, isSelected: true },
        { field: 'AppointmentDate', header: 'Appointment Dt', dataType: DataType.date, isSelected: true },
        { field: '$createdAt', header: 'Created At', dataType: DataType.dateTime, isSelected: false },
        { field: '$updatedAt', header: 'Updated At', dataType: DataType.dateTime, isSelected: false }
    ];

    const search = () => {
        const queries = [];

        if (selectedPatient) {
            queries.push(Query.equal('Patients', selectedPatient.$id));
        }

        if (selectedDoctor) {
            queries.push(Query.equal('Doctors', selectedDoctor.$id));
        }

        getAppointments(queries);
    }

    const getAppointments = (queries = []) => {
        setLoading(true);
        appointmentService.getAppointments(queries)
            .then(res => {
                if (res.documents) {
                    setAppointments(res.documents);
                    setLoading(false);
                }
            });
    }

    const editAppointment = (rowData) => {
        dispatch(switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData }));
    }

    const deleteAppointment = async (rowData) => {
        confirm('Are You Sure To Delete This Appointment?',
            (isConfirmed) => {
                if (isConfirmed) {
                    setLoading(true);
                    appointmentService.deleteAppointment(rowData.$id)
                        .finally(() => setLoading(false))
                        .then(res => {
                            if (res) {
                                notify.succes('Deleted Successfully!');
                                getAppointments();
                            }
                        });
                }
            }
        );
    }

    useEffect(() => {
        patientService.getPatients([])
            .then(res => {
                if (res.documents) {
                    setPatients(res.documents);
                }
            });

        doctorService.getDoctors([])
            .then(res => {
                if (res.documents) {
                    setDoctors(res.documents);
                }
            });

        if (switchData?.Id) {
            const query = switchData?.Id ? [Query.equal('Id', switchData?.Id)] : [];
            getAppointments(query);
        }
    }, [switchData?.Id]);

    const actionFields = [
        { functionRef: editAppointment, label: 'Edit' },
        { functionRef: deleteAppointment, label: 'Delete' }
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Appointments</h1>
                <Button className='mt-2' onClickEvent={navigatePage}>Create Appointment</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <PRAutoComplete items={patients} selectedItem={selectedPatient} setSelectedItem={setSelectedPatient} property='Name' label='Patient' />
                    </div>

                    <div className="w-full md:w-3/12">
                        <PRAutoComplete items={doctors} selectedItem={selectedDoctor} setSelectedItem={setSelectedDoctor} property='Name' label='Doctor' />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={appointments} loading={loading} cols={cols} actions={actionFields} />
                </div>
            </div>
        </div>
    );
};

export default ManageAppointment;