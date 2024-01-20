/* eslint-disable react/prop-types */
import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Input, Button, PRCalendar} from '../index';
import patientService from '../../appwrite/patient.service';
import { useDispatch, useSelector } from 'react-redux';
import { switchPage } from '../../store/pageSwitchSlice';
import { PageSwitch } from '../../shared/AppEnum';
import { notify } from '../../shared/Utility';

const CreateOrEditPatient = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);
    const [isLoading, setIsLoading] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);

    const {register, handleSubmit} = useForm({
        defaultValues: {
            $id: switchData?.$id || null,
            Name: switchData?.Name || null,
            Address: switchData?.Address || null,
            Mobile: switchData?.Mobile || null,
            EmergencyContactNo: switchData?.EmergencyContactNo || null
        }
    });

    const submitForm = async (data) => {
        setIsLoading(true);
        try{
            if (switchData) {
                patientService.updatePatient(switchData.$id, {...data, DateOfBirth: dateOfBirth})
                    .finally(() => setIsLoading(false))
                    .then(res => {
                        if (res) {
                            notify.succes('Updated Successfully!');
                            dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: res}));
                        }
                    });
            } else {
                patientService.createPatient({...data, DateOfBirth: dateOfBirth})
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

    const navigateBack = () => {
        dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: null}));
    }

    useEffect(() => {
        if (switchData?.DateOfBirth) {
            setDateOfBirth(new Date(switchData.DateOfBirth));
        }
    }, [switchData?.DateOfBirth]);

    return (
        <section className="w-full h-full bg-white">
            <div className="flex justify-between items-center ml-5 mr-5 mb-5">
                <Button className='mt-2' onClickEvent={navigateBack} isLoading={isLoading}>Go Back</Button>
            </div>

            <div className="flex flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-2xl xl:p-0 border border-gray-300 shadow-xl shadow-cyan-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {!switchData ? 'Create Patient' : 'Update Patient'}
                        </h1>
                        <form onSubmit={handleSubmit(submitForm)} action='#'>
                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <Input label="Name" placeholder="Enter Patient Name" className="mb-4" {...register("Name", { required: true })} />
                                </div>
                                <div className='w-full md:w-1/2 px-2'>
                                    <PRCalendar label="Date Of Birth" calendarVal={dateOfBirth} setCalendarVal={setDateOfBirth} showIcon />
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <Input label="Mobile" placeholder="Enter Mobile" className="mb-4" {...register("Mobile", { required: true })} />
                                </div>

                                <div className='w-full md:w-1/2 px-2'>
                                    <Input label="Emergency Contact" placeholder="Enter Emergency Contact" className="mb-4" {...register("EmergencyContactNo")} />
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='w-full px-2'>
                                    <Input label="Address" placeholder="Enter Address" className="mb-4" {...register("Address", { required: true })} />
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

export default CreateOrEditPatient;