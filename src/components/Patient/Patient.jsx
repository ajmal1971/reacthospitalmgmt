/* eslint-disable react/prop-types */
import { PageSwitch } from "../../shared/AppEnum";
import { useSelector } from "react-redux";
import {ManagePatient, CreateOrEditPatient} from '../index.js';

const Patient = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManagePatient/> : <CreateOrEditPatient/>;
};

export default Patient;