/* eslint-disable react/prop-types */
import { PageSwitch } from "../../../shared/AppEnum";
import { useSelector } from "react-redux";
import {ManageAppointment, CreateOrEditAppointment} from '../../index.js';

const Appointment = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManageAppointment/> : <CreateOrEditAppointment/>;
};

export default Appointment;