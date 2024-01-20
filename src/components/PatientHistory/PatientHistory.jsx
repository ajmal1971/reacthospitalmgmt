/* eslint-disable react/prop-types */
import { PageSwitch } from "../../shared/AppEnum";
import { useSelector } from "react-redux";
import {ManagePatientHistory, CreateOrEditPatientHistory} from '../index.js';

const PatientHistory = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManagePatientHistory/> : <CreateOrEditPatientHistory/>;
};

export default PatientHistory;