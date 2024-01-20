/* eslint-disable react/prop-types */
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Input, Button, PRAutoComplete, PRCalendar} from '../index';
import doctorService from '../../appwrite/doctor.service';
import patientService from '../../appwrite/patient.service';
import patientHistoryService from '../../appwrite/patienthistory.service';
import { useDispatch, useSelector } from 'react-redux';
import { switchPage } from '../../store/pageSwitchSlice';
import { PageSwitch } from '../../shared/AppEnum';
import { notify } from '../../shared/Utility';

const CreateOrEditPatientHistory = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);
    const [selectedPatient, setSelectedPatient] = useState(undefined);
    const [date, setDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit} = useForm({
        defaultValues: {
            $id: switchData?.$id || null,
            PatientId: switchData?.patient.$id || null,
            DoctorId: switchData?.doctor.$id || null,
            Note: switchData?.Note || null
        }
    });

    const submitForm = async (data) => {
        setIsLoading(true);
        try{
            if (switchData) {
                patientHistoryService.updatePatientHistory(switchData.$id, {...data, PatientId: selectedPatient.$id, DoctorId: selectedDoctor.$id, Date: date})
                    .finally(() => setIsLoading(false))
                    .then(res => {
                        if (res) {
                            notify.succes('Updated Successfully!');
                            dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: res}));
                        }
                    });
            } else {
                patientHistoryService.createPatientHistory({...data, PatientId: selectedPatient.$id, DoctorId: selectedDoctor.$id, Date: date})
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
        doctorService.getDoctors([])
            .then(res => {
                if (res.documents) {
                    setDoctors(res.documents);
                    if (switchData) {
                        setSelectedDoctor(res.documents.find(item => item.$id === switchData?.doctor.$id));
                    }
                }
            });

        patientService.getPatients([])
            .then(res => {
                if (res.documents) {
                    setPatients(res.documents);
                    if (switchData) {
                        setSelectedPatient(res.documents.find(item => item.$id === switchData?.patient.$id));
                    }
                }
            });

        if (switchData?.Date) {
            setDate(new Date(switchData.Date));
        }
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
                            {!switchData ? 'Create Patient History' : 'Update Patient History'}
                        </h1>
                        <form onSubmit={handleSubmit(submitForm)} action="#">
                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <PRAutoComplete items={doctors} selectedItem={selectedDoctor} setSelectedItem={setSelectedDoctor} property='DoctorName' label='Doctor'/>
                                </div>

                                <div className='w-full md:w-1/2 px-2'>
                                <PRAutoComplete items={patients} selectedItem={selectedPatient} setSelectedItem={setSelectedPatient} property='Name' label='Patient'/>
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <PRCalendar label="Date" calendarVal={date} setCalendarVal={setDate} showIcon />
                                </div>

                                <div className='w-full md:w-1/2 px-2'>
                                    <Input label="Note" placeholder="Enter Note" className="mb-4" {...register("Note")} />
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

export default CreateOrEditPatientHistory;