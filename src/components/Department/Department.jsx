/* eslint-disable react/prop-types */
import { PageSwitch } from "../../shared/AppEnum";
import {ManageDepartment, CreateOrEditDepartment} from "../index";
import { useSelector } from "react-redux";

const Department = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManageDepartment/> : <CreateOrEditDepartment/>;
};

export default Department;