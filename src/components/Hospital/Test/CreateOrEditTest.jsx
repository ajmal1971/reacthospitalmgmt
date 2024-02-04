/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button } from "../../index";
import testService from "../../../appwrite/test.service";
import { switchPage } from "../../../store/pageSwitchSlice";
import { PageSwitch } from "../../../shared/AppEnum";
import { notify } from "../../../shared/Utility";

const CreateOrEditTest = () => {
  const dispatch = useDispatch();
  const switchData = useSelector((state) => state.pageSwitch.switchData);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      $id: switchData?.$id || null,
      Name: switchData?.Name || "",
      Description: switchData?.Description || "",
      Cost: switchData?.Cost || "",
    },
  });

  const submitForm = async (data) => {
    setIsLoading(true);
    try {
      if (switchData) {
        testService
          .updateTest(switchData.$id, { ...data })
          .finally(() => setIsLoading(false))
          .then((res) => {
            if (res) {
              notify.succes("Updated Successfully!");
              dispatch(
                switchPage({ pageIndex: PageSwitch.ViewPage, switchData: res })
              );
            }
          });
      } else {
        testService
          .createTest({ ...data })
          .finally(() => setIsLoading(false))
          .then((res) => {
            if (res) {
              notify.succes("Created Successfully!");
              dispatch(
                switchPage({ pageIndex: PageSwitch.ViewPage, switchData: res })
              );
            }
          });
      }
    } catch (error) {
      notify.error(error);
    }
  };

  const navigateBack = () => {
    dispatch(switchPage({ pageIndex: PageSwitch.ViewPage, switchData: null }));
  };

  return (
    <section className="w-full h-full bg-white">
      <div className="flex justify-between items-center ml-5 mr-5 mb-5">
        <Button
          className="mt-2"
          onClickEvent={navigateBack}
          isLoading={isLoading}
        >
          Go Back
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0 border border-gray-300 shadow-xl shadow-cyan-200">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {!switchData ? "Create Test" : "Update Test"}
            </h1>
            <form
              onSubmit={handleSubmit(submitForm)}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <Input
                label="Name"
                placeholder="Enter Test Name"
                className="mb-4"
                {...register("Name", { required: true })}
              />

              <Input
                label="Description"
                placeholder="Enter Description"
                className="mb-4"
                {...register("Description")}
              />

              <Input
                label="Cost"
                type="number"
                placeholder="Enter Cost"
                className="mb-4"
                {...register("Cost", { required: true })}
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                {switchData ? "Update" : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateOrEditTest;
