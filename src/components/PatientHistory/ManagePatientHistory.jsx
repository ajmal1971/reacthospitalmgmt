/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch } from "../../shared/AppEnum";
import doctorService from "../../appwrite/doctor.service";
import patientService from '../../appwrite/patient.service';
import patientHistoryService from '../../appwrite/patienthistory.service';
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from '../../store/pageSwitchSlice';
import { Query } from 'appwrite';
import { PRDataTable, PRAutoComplete, Button } from '../index';
import { notify, confirm } from "../../shared/Utility";

const ManagePatientHistory = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    
    const [loading, setLoading] = useState(false);
    const [patientHistories, setPatientHistories] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);
    const [selectedPatient, setSelectedPatient] = useState(undefined);

    const cols = [
        { field: 'patient.Name', header: 'Patient', dataType: 'string', isSelected: true },
        { field: 'doctor.DoctorName', header: 'Doctor', dataType: 'string', isSelected: true },
        { field: 'Date', header: 'Date', dataType: 'date', isSelected: true },
        { field: 'Note', header: 'Note', dataType: 'string', isSelected: false },
        { field: '$createdAt', header: 'Created At', dataType: 'date', isSelected: false },
        { field: '$updatedAt', header: 'Updated At', dataType: 'date', isSelected: false }
    ];

    const search = () => {
        const queries = [];

        if (selectedDoctor) {
            queries.push(Query.equal('doctor', selectedDoctor.$id));
        }

        if (selectedPatient) {
            queries.push(Query.equal('patient', selectedPatient.$id));
        }

        getPatientHistories(queries);
    }

    const getPatientHistories = (queries = []) => {
        setLoading(true);
        patientHistoryService.getPatientHistories(queries)
            .then(res => {
                if (res.documents) {
                    setPatientHistories(res.documents);
                    setLoading(false);
                }
            });
    }

    const editPatientHistory = (rowData) => {
        dispatch(switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData }));
    }

    const deletePatientHistory = async (rowData) => {
        confirm('Are You Sure To Delete This Patient History?',
            (isConfirmed) => {
                if (isConfirmed) {
                    setLoading(true);
                    patientHistoryService.deletePatientHistory(rowData.$id)
                        .finally(() => setLoading(false))
                        .then(res => {
                            if (res) {
                                notify.succes('Deleted Successfully!');
                                getPatientHistories();
                            }
                        });
                }
            }
        );
    }

    useEffect(() => {
        doctorService.getDoctors([])
            .then(res => {
                if (res.documents) {
                    setDoctors(res.documents);
                }
            });

        patientService.getPatients([])
            .then(res => {
                if (res.documents) {
                    setPatients(res.documents);
                }
            });

        if (switchData?.PatientHistoryId) {
            const query = switchData?.PatientHistoryId ? [Query.equal('PatientHistoryId', switchData?.PatientHistoryId)] : [];
            getPatientHistories(query);
        }
    }, [switchData?.PatientHistoryId]);

    const actionFields = [
        { functionRef: editPatientHistory, label: 'Edit' },
        { functionRef: deletePatientHistory, label: 'Delete' }
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Patient History</h1>
                <Button className='mt-2' onClickEvent={navigatePage}>Create Patient History</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <PRAutoComplete items={doctors} selectedItem={selectedDoctor} setSelectedItem={setSelectedDoctor} property='DoctorName' label='Doctor' />
                    </div>

                    <div className="w-full md:w-3/12">
                        <PRAutoComplete items={patients} selectedItem={selectedPatient} setSelectedItem={setSelectedPatient} property='Name' label='Patient' />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={patientHistories} loading={loading} cols={cols} actions={actionFields} />
                </div>
            </div>
        </div>
    );
};

export default ManagePatientHistory;