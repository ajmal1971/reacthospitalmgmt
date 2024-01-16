/* eslint-disable react/prop-types */
import { PageSwitch } from "../../shared/AppEnum";
import {ManageDiagnosis, CreateOrEditDiagnosis} from "../index";
import { useSelector } from "react-redux";

const Diagnosis = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManageDiagnosis/> : <CreateOrEditDiagnosis/>;
};

export default Diagnosis;