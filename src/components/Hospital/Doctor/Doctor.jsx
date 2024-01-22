/* eslint-disable react/prop-types */
import { PageSwitch } from "../../../shared/AppEnum";
import { useSelector } from "react-redux";
import {ManageDoctor, CreateOrEditDoctor} from '../../index.js';

const Doctor = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    console.log(pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManageDoctor/> : <CreateOrEditDoctor/>;
};

export default Doctor;