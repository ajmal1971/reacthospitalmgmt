/* eslint-disable react/prop-types */
import {useForm} from 'react-hook-form';
import {Input, Button} from '../index';
import departmentService from '../../appwrite/department.service';
import { useDispatch, useSelector } from 'react-redux';
import { switchPage } from '../../store/pageSwitchSlice';
import { PageSwitch } from '../../shared/AppEnum';
import { notify } from '../../shared/Utility';

const CreateOrEditDepartment = () => {
    const dispatch = useDispatch();
    const switchData = useSelector(state => state.pageSwitch.switchData);

    const {register, handleSubmit} = useForm({
        defaultValues: {
            $id: switchData?.$id || null,
            Name: switchData?.Name || '',
            Mobile: switchData?.Mobile || ''
        }
    });

    const submitForm = async (data) => {
        if (switchData) {
            const response = await departmentService.updateDepartment(switchData.$id, {...data});

            if (response) {
                notify.succes('Updated Successfully!');
                dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: response}));
            }
        } else {
            const response = await departmentService.createDepartment({...data});
            if (response) {
                notify.succes('Created Successfully!');
                dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: response}));
            }
        }
    }

    return (
        <section className="w-full h-full bg-white">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0 border border-gray-300 shadow-xl shadow-cyan-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {!switchData ? 'Create Department' : 'Update Department'}
                        </h1>
                        <form onSubmit={handleSubmit(submitForm)} className="space-y-4 md:space-y-6" action="#">
                            <Input label="Name" placeholder="Enter Department Name" className="mb-4" {...register("Name", { required: true })} />

                            <Input label="Mobile" placeholder="Enter Mobile" className="mb-4" {...register("Mobile", { required: true })} />
                            
                            <Button type="submit" className="w-full">
                                {switchData ? "Update" : "Submit"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateOrEditDepartment;