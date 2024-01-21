/* eslint-disable react/prop-types */
import { PageSwitch } from "../../shared/AppEnum";
import { useSelector } from "react-redux";
import {ManagePatientFollowupHistory, CreateOrEditPatientFollowupHistory} from '../index.js';

const PatientFollowupHistory = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManagePatientFollowupHistory/> : <CreateOrEditPatientFollowupHistory/>;
};

export default PatientFollowupHistory;