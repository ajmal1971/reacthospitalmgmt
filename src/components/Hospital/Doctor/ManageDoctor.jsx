/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import doctorService from "../../../appwrite/doctor.service";
import departmentService from '../../../appwrite/department.service';
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from '../../../store/pageSwitchSlice';
import { Query } from 'appwrite';
import { Input, PRDataTable, PRAutoComplete, Button } from '../../index';
import { notify, confirm } from "../../../shared/Utility";

const ManageDoctor = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);

    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(undefined);

    const [searchFilter, setSearchFilter] = useState({ Name: '', Mobile: '', Specialization: '' });

    const cols = [
        { field: '$id', header: 'Id', dataType: DataType.string, isSelected: false },
        { field: 'Departments.Name', header: 'Department', dataType: DataType.string, isSelected: true },
        { field: 'Name', header: 'Name', dataType: DataType.string, isSelected: true },
        { field: 'Specialization', header: 'Specialization', dataType: DataType.string, isSelected: true },
        { field: 'Mobile', header: 'Mobile', dataType: DataType.string, isSelected: true },
        { field: '$createdAt', header: 'Created At', dataType: DataType.dateTime, isSelected: false },
        { field: '$updatedAt', header: 'Updated At', dataType: DataType.dateTime, isSelected: false }
    ];

    const search = () => {
        const queries = [];
        if (searchFilter.Name && searchFilter.Name.toString().trim() !== '') {
            queries.push(Query.equal('Name', searchFilter.Name));
        }

        if (selectedDepartment) {
            queries.push(Query.equal('Departments', selectedDepartment.$id));
        }

        if (searchFilter.Mobile && searchFilter.Mobile.toString().trim() !== '') {
            queries.push(Query.equal('Mobile', searchFilter.Mobile));
        }

        if (searchFilter.Specialization && searchFilter.Specialization.toString().trim() !== '') {
            queries.push(Query.equal('Specialization', searchFilter.Specialization));
        }

        getDoctors(queries);
    }

    const getDoctors = (queries = []) => {
        setLoading(true);
        doctorService.getDoctors(queries)
            .then(res => {
                if (res.documents) {
                    setDoctors(res.documents);
                    setLoading(false);
                }
            });
    }

    const editDoctor = (rowData) => {
        dispatch(switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData }));
    }

    const deleteDoctor = async (rowData) => {
        confirm('Are You Sure To Delete This Doctor?',
            (isConfirmed) => {
                if (isConfirmed) {
                    setLoading(true);
                    doctorService.deleteDoctor(rowData.$id)
                        .finally(() => setLoading(false))
                        .then(res => {
                            if (res) {
                                notify.succes('Deleted Successfully!');
                                getDoctors();
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

        if (switchData?.Id) {
            const query = switchData?.Id ? [Query.equal('Id', switchData?.Id)] : [];
            getDoctors(query);
        }
    }, [switchData?.Id]);

    const actionFields = [
        { functionRef: editDoctor, label: 'Edit' },
        { functionRef: deleteDoctor, label: 'Delete' }
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Doctors</h1>
                <Button className='mt-2' onClickEvent={navigatePage}>Create Doctor</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <PRAutoComplete items={departments} selectedItem={selectedDepartment} setSelectedItem={setSelectedDepartment} property='Name' label='Department' />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Doctor Name" placeholder="Enter Doctor Name" value={searchFilter.Name} onChange={(e) => setSearchFilter((prev) => ({ ...prev, Name: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Mobile" placeholder="Enter Doctor Mobile" value={searchFilter.Mobile} onChange={(e) => setSearchFilter((prev) => ({ ...prev, Mobile: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Specialization" placeholder="Enter Doctor Specialization" value={searchFilter.Specialization} onChange={(e) => setSearchFilter((prev) => ({ ...prev, Specialization: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={doctors} loading={loading} cols={cols} actions={actionFields} />
                </div>
            </div>
        </div>
    );
};

export default ManageDoctor;