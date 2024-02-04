/* eslint-disable react/prop-types */
import { PageSwitch } from "../../../shared/AppEnum";
import { useSelector } from "react-redux";
import { ManageTest, CreateOrEditTest } from "../../index.js";

const Test = () => {
  const pageIndex = useSelector((state) => state.pageSwitch.pageIndex);

  return pageIndex === PageSwitch.ViewPage ? (
    <ManageTest />
  ) : (
    <CreateOrEditTest />
  );
};

export default Test;
