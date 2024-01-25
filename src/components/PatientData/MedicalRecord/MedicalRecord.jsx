/* eslint-disable react/prop-types */
import { PageSwitch } from "../../../shared/AppEnum";
import { useSelector } from "react-redux";
import {ManageMedicalRecord, CreateOrEditMedicalRecord} from '../../index.js';

const MedicalRecord = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManageMedicalRecord/> : <CreateOrEditMedicalRecord/>;
};

export default MedicalRecord;