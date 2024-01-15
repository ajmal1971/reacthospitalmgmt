/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch } from "../../shared/AppEnum";
import doctorService from "../../appwrite/doctor.service";
import departmentService from '../../appwrite/department.service';
import { useDispatch, useSelector } from "react-redux";
import {switchPage} from '../../store/pageSwitchSlice';
import {Query} from 'appwrite';
import {Input, PRDataTable, PRAutoComplete, Button} from '../index';
import { notify } from "../../shared/Utility";

const ManageDoctor = () => {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(undefined);
    const [searchFilter, setSearchFilter] = useState({doctorName: '', mobile: '', speciality: ''});

    const cols = [
        {field: 'department.Name', header: 'Department', dataType: 'string'},
        {field: 'DoctorName', header: 'Name', dataType: 'string'},
        {field: 'Speciality', header: 'Speciality', dataType: 'string'},
        {field: 'VisitPrice', header: 'Visit Price', dataType: 'number'},
        {field: 'Mobile', header: 'Mobile', dataType: 'string'},
        {field: '$createdAt', header: 'Created At', dataType: 'date'},
        {field: '$updatedAt', header: 'Updated At', dataType: 'date'}
    ];
    
    const search = () => {
        const queries = [];
        if (searchFilter.doctorName && searchFilter.doctorName.toString().trim() !== '') {
            queries.push(Query.equal('DoctorName', searchFilter.doctorName));
        }

        if (selectedDepartment) {
            queries.push(Query.equal('department', selectedDepartment.$id));
        }

        if (searchFilter.mobile && searchFilter.mobile.toString().trim() !== '') {
            queries.push(Query.equal('Mobile', searchFilter.mobile));
        }

        if (searchFilter.speciality && searchFilter.speciality.toString().trim() !== '') {
            queries.push(Query.equal('Speciality', searchFilter.speciality));
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
        dispatch(switchPage({pageIndex: PageSwitch.EditPage, switchData: rowData}));
    }

    const deleteDoctor = async (rowData) => {
        await doctorService.deleteDoctor(rowData.$id)
        .then(res => {
            if (res) {
                notify.succes('Deleted Successfully!');
                getDoctors();
            }
        });
    }

    useEffect(() => {
        departmentService.getDepartments([])
            .then(res => {
                if (res.documents) {
                    setDepartments(res.documents);
                }
            });

        if (switchData?.DoctorId) {
            const query = switchData?.DoctorId ? [Query.equal('DoctorId', switchData?.DoctorId)] : [];
            getDoctors(query);
        }
    }, [switchData?.DoctorId]);

    const actionFields = [
        {functionRef: editDoctor, label: 'Edit'},
        {functionRef: deleteDoctor, label: 'Delete'}
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Doctors</h1>
                <Button onClickEvent={navigatePage}>Create Doctor</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <PRAutoComplete items={departments} selectedItem={selectedDepartment} setSelectedItem={setSelectedDepartment} property='Name' label='Department'/>
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Doctor Name" placeholder="Enter Doctor Name" value={searchFilter.doctorName} onChange={(e) => setSearchFilter((prev) => ({...prev, doctorName: e.target.value}))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Mobile" placeholder="Enter Doctor Mobile" value={searchFilter.mobile} onChange={(e) => setSearchFilter((prev) => ({...prev, mobile: e.target.value}))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Input label="Speciality" placeholder="Enter Doctor Speciality" value={searchFilter.speciality} onChange={(e) => setSearchFilter((prev) => ({...prev, speciality: e.target.value}))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={doctors} loading={loading} cols={cols} actions={actionFields}/>
                </div>
            </div>
        </div>
    );
};

export default ManageDoctor;