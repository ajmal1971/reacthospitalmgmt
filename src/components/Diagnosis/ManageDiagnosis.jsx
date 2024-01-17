/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch } from "../../shared/AppEnum";
import diagnosesService from "../../appwrite/diagnoses.service";
import departmentService from '../../appwrite/department.service';
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from '../../store/pageSwitchSlice';
import { Query } from 'appwrite';
import { Input, PRDataTable, Button, PRAutoComplete } from '../index';
import { notify } from "../../shared/Utility";
import { confirm } from "../../shared/Utility";

const ManageDiagnosis = () => {
    const [loading, setLoading] = useState(false);
    const [diagnoses, setDiagnoses] = useState([]);
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(undefined);
    const [searchFilter, setSearchFilter] = useState({ name: '', DepartmentId: '', mobile: '' });

    const cols = [
        { field: 'department.Name', header: 'Department', dataType: 'string', isSelected: true },
        { field: 'Name', header: 'Name', dataType: 'string', isSelected: true },
        { field: 'Price', header: 'Price', dataType: 'number', isSelected: true },
        { field: 'Mobile', header: 'Mobile', dataType: 'string', isSelected: true },
        { field: 'Email', header: 'Email', dataType: 'string', isSelected: true },
        { field: 'LabAddress', header: 'Lab Address', dataType: 'string', isSelected: true },
        { field: '$createdAt', header: 'Created At', dataType: 'date', isSelected: false },
        { field: '$updatedAt', header: 'Updated At', dataType: 'date', isSelected: false }
    ];

    const search = () => {
        const queries = [];
        if (searchFilter.name && searchFilter.name.toString().trim() !== '') {
            queries.push(Query.equal('Name', searchFilter.name));
        }

        if (selectedDepartment) {
            queries.push(Query.equal('department', selectedDepartment.$id));
        }

        if (searchFilter.mobile && searchFilter.mobile.toString().trim() !== '') {
            queries.push(Query.equal('Mobile', searchFilter.mobile));
        }

        getDiagnoses(queries);
    }

    const getDiagnoses = (queries = []) => {
        setLoading(true);
        diagnosesService.getDiagnoses(queries)
            .then(res => {
                if (res.documents) {
                    setDiagnoses(res.documents);
                    setLoading(false);
                }
            });
    }

    const editDiagnosis = (rowData) => {
        dispatch(switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData }));
    }

    const deleteDiagnosis = async (rowData) => {
        confirm('Are You Sure To Delete This Diagnosis?',
            (isConfirmed) => {
                if (isConfirmed) {
                    setLoading(true);
                    diagnosesService.deleteDiagnosis(rowData.$id)
                        .finally(() => setLoading(false))
                        .then(res => {
                            if (res) {
                                notify.succes('Deleted Successfully!');
                                getDiagnoses();
                            }
                        });
                }
            }
        );
    }

    useEffect(() => {
        departmentService.getDepartments([])
            .then(res => {
                if (res.documents) {
                    setDepartments(res.documents);
                }
            });

        if (switchData?.DiagnosisId) {
            const query = switchData?.DiagnosisId ? [Query.equal('DiagnosisId', switchData?.DiagnosisId)] : [];
            getDiagnoses(query);
        }
    }, [switchData?.DiagnosisId]);

    const actionFields = [
        { functionRef: editDiagnosis, label: 'Edit' },
        { functionRef: deleteDiagnosis, label: 'Delete' }
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Diagnoses</h1>
                <Button className='mt-2' onClickEvent={navigatePage}>Create Diagnosis</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <PRAutoComplete items={departments} selectedItem={selectedDepartment} setSelectedItem={setSelectedDepartment} property='Name' label='Department' />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Name" placeholder="Enter Diagnosis Name" value={searchFilter.name} onChange={(e) => setSearchFilter((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Mobile" placeholder="Enter Mobile" value={searchFilter.mobile} onChange={(e) => setSearchFilter((prev) => ({ ...prev, mobile: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={diagnoses} loading={loading} cols={cols} actions={actionFields} />
                </div>
            </div>
        </div>
    );
};

export default ManageDiagnosis;