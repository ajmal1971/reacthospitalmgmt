/* eslint-disable react/prop-types */
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Input, Button, PRAutoComplete} from '../index';
import patientHistoryService from '../../appwrite/patienthistory.service';
import followupHistoryService from '../../appwrite/patientfollowuphistory.service';
import { useDispatch, useSelector } from 'react-redux';
import { switchPage } from '../../store/pageSwitchSlice';
import { PageSwitch } from '../../shared/AppEnum';
import { notify } from '../../shared/Utility';

const CreateOrEditPatientFollowupHistory = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    
    const [patientHistories, setPatientHistories] = useState([]);
    const [selectedPatientHistory, setSelectedPatientHistory] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit} = useForm({
        defaultValues: {
            $id: switchData?.$id || null,
            PatientHistoryId: switchData?.patientHistory.$id || null,
            Date: switchData?.Date || null,
            Note: switchData?.Note || null
        }
    });

    const submitForm = async (data) => {
        setIsLoading(true);
        try{
            if (switchData) {
                followupHistoryService.updatePatientFollowupHistory(switchData.$id, {...data, PatientHistoryId: selectedPatientHistory.$id})
                    .finally(() => setIsLoading(false))
                    .then(res => {
                        if (res) {
                            notify.succes('Updated Successfully!');
                            dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: res}));
                        }
                    });
            } else {
                followupHistoryService.createPatientFollowupHistory({...data, PatientHistoryId: selectedPatientHistory.$id})
                    .finally(() => setIsLoading(false))
                    .then(res => {
                        if (res) {
                            notify.succes('Created Successfully!');
                            dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: res}));
                        }
                    });
            }
        }
        catch(error) {
            notify.error();
        }
    }

    useEffect(() => {
        patientHistoryService.getPatientHistories([])
            .then(res => {
                if (res.documents) {
                    setPatientHistories(res.documents);
                    if (switchData) {
                        setSelectedPatientHistory(res.documents.find(item => item.$id === switchData?.patientHistory.$id));
                    }
                }
            });
    }, [switchData]);

    const navigateBack = () => {
        dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: null}));
    }

    return (
        <section className="w-full h-full bg-white">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <Button className='mt-2' onClickEvent={navigateBack} isLoading={isLoading}>Go Back</Button>
            </div>

            <div className="flex flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-2xl xl:p-0 border border-gray-300 shadow-xl shadow-cyan-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {!switchData ? 'Create Doctor' : 'Update Doctor'}
                        </h1>
                        <form onSubmit={handleSubmit(submitForm)} action="#">
                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <PRAutoComplete items={patientHistories} selectedItem={selectedPatientHistory} setSelectedItem={setSelectedPatientHistory} property='Name' label='Department'/>
                                </div>

                                <div className='w-full md:w-1/2 px-2'>
                                    <Input label="Name" placeholder="Enter Doctor Name" className="mb-4" {...register("DoctorName", { required: true })} />
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <Input label="Mobile" placeholder="Enter Mobile" className="mb-4" {...register("Mobile", { required: true })} />
                                </div>

                                <div className='w-full md:w-1/2 px-2'>
                                    <Input label="Speciality" placeholder="Enter Speciality" className="mb-4" {...register("Speciality", { required: true })} />
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <Input type="number" label="VisitPrice" placeholder="Enter VisitPrice" className="mb-4" {...register("VisitPrice", { required: true })} />
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='w-2/3 px-2 mx-auto'>
                                    <Button type="submit" className="w-full" isLoading={isLoading}>
                                        {switchData ? "Update" : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateOrEditPatientFollowupHistory;