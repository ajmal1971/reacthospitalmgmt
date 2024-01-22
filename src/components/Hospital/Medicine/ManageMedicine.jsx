/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import medicineService from "../../../appwrite/medicine.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from '../../../store/pageSwitchSlice';
import { Query } from 'appwrite';
import { Input, PRDataTable, Button } from '../../index';
import { notify, confirm } from "../../../shared/Utility";

const ManageMedicine = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);

    const [loading, setLoading] = useState(false);
    const [medicines, setMedicines] = useState([]);

    const [searchFilter, setSearchFilter] = useState({ Name: ''});

    const cols = [
        { field: '$id', header: 'Id', dataType: DataType.string, isSelected: false },
        { field: 'Name', header: 'Name', dataType: DataType.string, isSelected: true },
        { field: 'Description', header: 'Description', dataType: DataType.string, isSelected: true },
        { field: '$createdAt', header: 'Created At', dataType: DataType.dateTime, isSelected: false },
        { field: '$updatedAt', header: 'Updated At', dataType: DataType.dateTime, isSelected: false }
    ];

    const search = () => {
        const queries = [];
        if (searchFilter.Name && searchFilter.Name.toString().trim() !== '') {
            queries.push(Query.equal('Name', searchFilter.Name));
        }

        getMedicines(queries);
    }

    const getMedicines = (queries = []) => {
        setLoading(true);
        medicineService.getMedicines(queries)
            .then(res => {
                if (res.documents) {
                    setMedicines(res.documents);
                    setLoading(false);
                }
            });
    }

    const editMedicine = (rowData) => {
        dispatch(switchPage({ pageIndex: PageSwitch.EditPage, switchData: rowData }));
    }

    const deleteMedicine = async (rowData) => {
        confirm('Are You Sure To Delete This Medicine?',
            (isConfirmed) => {
                if (isConfirmed) {
                    setLoading(true);
                    medicineService.deleteMedicine(rowData.$id)
                        .finally(() => setLoading(false))
                        .then(res => {
                            if (res) {
                                notify.succes('Deleted Successfully!');
                                getMedicines();
                            }
                        });
                }
            }
        );
    }

    useEffect(() => {
        if (switchData?.Id) {
            const query = switchData?.Id ? [Query.equal('Id', switchData?.Id)] : [];
            getMedicines(query);
        }
    }, [switchData?.Id]);

    const actionFields = [
        { functionRef: editMedicine, label: 'Edit' },
        { functionRef: deleteMedicine, label: 'Delete' }
    ];

    const navigatePage = () => {
        dispatch(switchPage(PageSwitch.CreatePage));
    }

    return (
        <div className="flex flex-col min-h-screen flex-1">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <h1 className="text-3xl font-bold text-gray-700">Manage Medicines</h1>
                <Button className='mt-2' onClickEvent={navigatePage}>Create Medicine</Button>
            </div>

            <div className="flex justify-center mb-3">
                <div className="w-11/12 flex gap-2">
                    <div className="w-full md:w-3/12">
                        <Input label="Name" placeholder="Enter Name" value={searchFilter.Name} onChange={(e) => setSearchFilter((prev) => ({ ...prev, Name: e.target.value }))} />
                    </div>

                    <div className="w-full md:w-3/12">
                        <Button onClickEvent={search} className='mt-7'>Search</Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
                    <PRDataTable value={medicines} loading={loading} cols={cols} actions={actionFields} />
                </div>
            </div>
        </div>
    );
};

export default ManageMedicine;