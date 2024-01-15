/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch } from "../../shared/AppEnum";
import departmentService from "../../appwrite/department.service";
import { useDispatch, useSelector } from "react-redux";
import {switchPage} from '../../store/pageSwitchSlice';
import {Query} from 'appwrite';
import {Input, PRDataTable, Button} from '../index';
import { notify } from "../../shared/Utility";
        

const ManageDepartment = () => {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    const [searchFilter, setSearchFilter] = useState({name: '', mobile: ''});

    const cols = [
        // {field: '$id', header: 'Id', dataType: 'string'},
        {field: 'Name', header: 'Name', dataType: 'string'},
        {field: 'Mobile', header: 'Mobile', dataType: 'string'},
        {field: '$createdAt', header: 'Created At', dataType: 'date'},
        {field: '$updatedAt', header: 'Updated At', dataType: 'date'}
    ];

    const search = () => {
        const queries = [];
        if (searchFilter.name && searchFilter.name.toString().trim() !== '') {
            queries.push(Query.equal('Name', searchFilter.name));
        }

        if (searchFilter.mobile && searchFilter.mobile.toString().trim() !== '') {
            queries.push(Query.equal('Mobile', searchFilter.mobile));
        }

        getDepartments(queries);
    }

    const getDepartments = (queries = []) => {
        setLoading(true);
        departmentService.getDepartments(queries)
            .then(res => {
                if (res.documents) {
                    setDepartments(res.documents);
                    setLoading(false);
                }
            });
    }

    const editDepartment = (rowData) => {
        dispatch(switchPage({pageIndex: PageSwitch.EditPage, switchData: rowData}));
    }

    const deleteDepartment = async (rowData) => {
        await departmentService.deleteDepartment(rowData.$id)
        .then(res => {
            if (res) {
                notify.succes('Deleted Successfully!');
                getDepartments();
            }
        });
    }

    useEffect(() => {
        if (switchData?.DepartmentId) {
            const query = switchData?.DepartmentId ? [Query.equal('DepartmentId', switchData?.DepartmentId)] : [];
            getDepartments(query);
        }
    }, [switchData?.DepartmentId]);

    const actionFields = [
        {functionRef: editDepartment, label: 'Edit'},
        {functionRef: deleteDepartment, label: 'Delete'}
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Departments</h1>
                <Button onClickEvent={navigatePage}>Create Department</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <Input label="Name" placeholder="Enter Department Name" value={searchFilter.name} onChange={(e) => setSearchFilter((prev) => ({...prev, name: e.target.value}))}/>
                    </div>
                    <div className="w-full md:w-3/12">
                        <Input label="Mobile" placeholder="Enter Department Mobile" value={searchFilter.mobile} onChange={(e) => setSearchFilter((prev) => ({...prev, mobile: e.target.value}))} />
                    </div>
                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={departments} loading={loading} cols={cols} actions={actionFields}/>
                </div>
            </div>
        </div>
    );
};

export default ManageDepartment;