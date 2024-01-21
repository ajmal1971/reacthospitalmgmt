/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch } from "../../shared/AppEnum";
import patientService from "../../appwrite/patient.service";
import followupHistoryService from '../../appwrite/patientfollowuphistory.service';
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from '../../store/pageSwitchSlice';
import { Query } from 'appwrite';
import { PRDataTable, PRAutoComplete, Button } from '../index';
import { notify, confirm } from "../../shared/Utility";

const ManagePatientFollowupHistory = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    
    const [loading, setLoading] = useState(false);

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(undefined);

    const [followupHistories, setFollowupHistories] = useState([]);

    const cols = [
        { field: 'patient.Name', header: 'Patient', dataType: 'string', isSelected: true },
        { field: 'Date', header: 'Date', dataType: 'date', isSelected: true },
        { field: 'Note', header: 'Note', dataType: 'string', isSelected: false },
        { field: '$createdAt', header: 'Created At', dataType: 'date', isSelected: false },
        { field: '$updatedAt', header: 'Updated At', dataType: 'date', isSelected: false }
    ];

    const search = () => {
        const queries = [];
        if (selectedPatient) {
            queries.push(Query.equal('patient', selectedPatient.$id));
        }

        getFollowupHistories(queries);
    }

    const getFollowupHistories = (queries = []) => {
        setLoading(true);
        followupHistoryService.getPatientFollowupHistories(queries)
            .then(res => {
                if (res.documents) {
                    setFollowupHistories(res.documents);
                    setLoading(false);
                }
            });
    }

    const editFollowupHistory = (rowData) => {
        dispatch(switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData }));
    }

    const deleteFollowupHistory = async (rowData) => {
        confirm('Are You Sure To Delete This Followup History?',
            (isConfirmed) => {
                if (isConfirmed) {
                    setLoading(true);
                    followupHistoryService.deletePatientFollowupHistory(rowData.$id)
                        .finally(() => setLoading(false))
                        .then(res => {
                            if (res) {
                                notify.succes('Deleted Successfully!');
                                getFollowupHistories();
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

        if (switchData?.PatientFollowupHistoryId) {
            const query = switchData?.PatientFollowupHistoryId ? [Query.equal('PatientFollowupHistoryId', switchData?.PatientFollowupHistoryId)] : [];
            getFollowupHistories(query);
        }
    }, [switchData?.PatientFollowupHistoryId]);

    const actionFields = [
        { functionRef: editFollowupHistory, label: 'Edit' },
        { functionRef: deleteFollowupHistory, label: 'Delete' }
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Patient Followup History</h1>
                <Button className='mt-2' onClickEvent={navigatePage}>Create Patient Followup History</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
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
                    <PRDataTable value={followupHistories} loading={loading} cols={cols} actions={actionFields} />
                </div>
            </div>
        </div>
    );
};

export default ManagePatientFollowupHistory;