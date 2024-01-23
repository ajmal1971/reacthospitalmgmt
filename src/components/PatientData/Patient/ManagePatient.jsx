/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch } from "../../../shared/AppEnum";
import patientService from "../../../appwrite/patient.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from '../../../store/pageSwitchSlice';
import { Query } from 'appwrite';
import { Input, PRDataTable, Button } from '../../index';
import { notify, confirm } from "../../../shared/Utility";

const ManagePatient = () => {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    const [searchFilter, setSearchFilter] = useState({ name: '', mobile: '', emergencyContact: '' });

    const cols = [
        { field: 'Name', header: 'Name', dataType: 'string', isSelected: true },
        { field: 'DateOfBirth', header: 'Date Of Birth', dataType: 'date', isSelected: true },
        { field: 'Mobile', header: 'Mobile', dataType: 'string', isSelected: true },
        { field: '$createdAt', header: 'Created At', dataType: 'date', isSelected: false },
        { field: '$updatedAt', header: 'Updated At', dataType: 'date', isSelected: false }
    ];

    const search = () => {
        const queries = [];
        if (searchFilter.name && searchFilter.name.toString().trim() !== '') {
            queries.push(Query.equal('Name', searchFilter.name));
        }

        if (searchFilter.mobile && searchFilter.mobile.toString().trim() !== '') {
            queries.push(Query.equal('Mobile', searchFilter.mobile));
        }

        getPatients(queries);
    }

    const getPatients = (queries = []) => {
        setLoading(true);
        patientService.getPatients(queries)
            .then(res => {
                if (res.documents) {
                    setPatients(res.documents);
                    setLoading(false);
                }
            });
    }

    const editPatient = (rowData) => {
        dispatch(switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData }));
    }

    const deletePatient = async (rowData) => {
        confirm('Are You Sure To Delete This Patient?',
            (isConfirmed) => {
                if (isConfirmed) {
                    setLoading(true);
                    patientService.deletePatient(rowData.$id)
                        .finally(() => setLoading(false))
                        .then(res => {
                            if (res) {
                                notify.succes('Deleted Successfully!');
                                getPatients();
                            }
                        });
                }
            }
        );
    }

    useEffect(() => {
        if (switchData?.Id) {
            const query = switchData?.Id ? [Query.equal('Id', switchData?.Id)] : [];
            getPatients(query);
        }
    }, [switchData?.Id]);

    const actionFields = [
        { functionRef: editPatient, label: 'Edit' },
        { functionRef: deletePatient, label: 'Delete' }
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Patients</h1>
                <Button className='mt-2' onClickEvent={navigatePage}>Create Patient</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <Input label="Patient Name" placeholder="Enter Patient Name" value={searchFilter.name} onChange={(e) => setSearchFilter((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Mobile" placeholder="Enter Patient Mobile" value={searchFilter.mobile} onChange={(e) => setSearchFilter((prev) => ({ ...prev, mobile: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={patients} loading={loading} cols={cols} actions={actionFields} />
                </div>
            </div>
        </div>
    );
};

export default ManagePatient;