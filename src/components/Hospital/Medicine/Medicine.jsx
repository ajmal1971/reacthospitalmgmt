/* eslint-disable react/prop-types */
import { PageSwitch } from "../../../shared/AppEnum.js";
import { useSelector } from "react-redux";
import {ManageMedicine, CreateOrEditMedicine} from '../../index.js';

const Medicine = () => {
    const pageIndex = useSelector(state => state.pageSwitch.pageIndex);

    return pageIndex === PageSwitch.ViewPage ? <ManageMedicine/> : <CreateOrEditMedicine/>;
};

export default Medicine;