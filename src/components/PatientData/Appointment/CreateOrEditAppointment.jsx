/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Button, PRAutoComplete, PRCalendar } from '../../index';
import patientService from '../../../appwrite/patient.service';
import doctorService from '../../../appwrite/doctor.service';
import appointmentService from '../../../appwrite/appointment.service';
import { useDispatch, useSelector } from 'react-redux';
import { switchPage } from '../../../store/pageSwitchSlice';
import { PageSwitch } from '../../../shared/AppEnum';
import { notify } from '../../../shared/Utility';

const CreateOrEditAppointment = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);

    const [isLoading, setIsLoading] = useState(false);

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(undefined);

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);

    const [appointmentDate, setAppointmentDate] = useState(null);

    const submitForm = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            if (switchData) {
                appointmentService.updateAppointment(switchData.$id, { PatientId: selectedPatient.$id, DoctorId: selectedDoctor.$id, AppointmentDate:  appointmentDate})
                    .finally(() => setIsLoading(false))
                    .then(res => {
                        if (res) {
                            notify.succes('Updated Successfully!');
                            dispatch(switchPage({ pageIndex: PageSwitch.ViewPage, switchData: res }));
                        }
                    });
            } else {
                appointmentService.createAppointment({ PatientId: selectedPatient.$id, DoctorId: selectedDoctor.$id, AppointmentDate:  appointmentDate })
                    .finally(() => setIsLoading(false))
                    .then(res => {
                        if (res) {
                            notify.succes('Created Successfully!');
                            dispatch(switchPage({ pageIndex: PageSwitch.ViewPage, switchData: res }));
                        }
                    });
            }
        }
        catch (error) {
            notify.error();
        }
    }

    useEffect(() => {
        patientService.getPatients([])
            .then(res => {
                if (res.documents) {
                    setPatients(res.documents);
                    if (switchData) {
                        setSelectedPatient(res.documents.find(item => item.$id === switchData?.Patients.$id));
                    }
                }
            });
        doctorService.getDoctors([])
            .then(res => {
                if (res.documents) {
                    setDoctors(res.documents);
                    if (switchData) {
                        setSelectedDoctor(res.documents.find(item => item.$id === switchData?.Doctors.$id));
                    }
                }
            });

        if (switchData?.AppointmentDate) {
            setAppointmentDate(new Date(switchData.AppointmentDate));
        }
    }, [switchData]);

    const navigateBack = () => {
        dispatch(switchPage({ pageIndex: PageSwitch.ViewPage, switchData: null }));
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
                            {!switchData ? 'Create Appointment' : 'Update Appointment'}
                        </h1>
                        <form onSubmit={submitForm} >
                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <PRAutoComplete items={patients} selectedItem={selectedPatient} setSelectedItem={setSelectedPatient} property='Name' label='Patient' />
                                </div>

                                <div className='w-full md:w-1/2 px-2'>
                                    <PRAutoComplete items={doctors} selectedItem={selectedDoctor} setSelectedItem={setSelectedDoctor} property='Name' label='Doctor' />
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='w-full md:w-1/2 px-2'>
                                    <PRCalendar label="Date Of Birth" calendarVal={appointmentDate} setCalendarVal={setAppointmentDate} showIcon />
                                </div>
                            </div>

                            <div className='flex flex-wrap mt-4'>
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

export default CreateOrEditAppointment;