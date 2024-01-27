/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import patientService from "../../../appwrite/patient.service";
import doctorService from "../../../appwrite/doctor.service";
import appointmentService from "../../../appwrite/appointment.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from "../../../store/pageSwitchSlice";
import { Query } from "appwrite";
import { PRDataTable, PRAutoComplete, Button } from "../../index";
import { notify, confirm } from "../../../shared/Utility";
import medicalRecordService from "../../../appwrite/medicalrecord.service";

const CreateOrEditMedicalRecord = () => {
  const dispatch = useDispatch();
  const switchData = useSelector((state) => state.pageSwitch.switchData);
  const pageIndex = useSelector((state) => state.pageSwitch.pageIndex);

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(undefined);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(undefined);

  const [selectedRecord, setSelectedRecord] = useState(undefined);
  const [showCreateField, setShowCreateField] = useState(false);

  const cols = [
    {
      field: "$id",
      header: "Id",
      dataType: DataType.string,
      isSelected: false,
    },
    {
      field: "Patients.Name",
      header: "Patient",
      dataType: DataType.string,
      isSelected: true,
    },
    {
      field: "Doctors.Name",
      header: "Doctor",
      dataType: DataType.string,
      isSelected: true,
    },
    {
      field: "AppointmentDate",
      header: "Appointment Dt",
      dataType: DataType.date,
      isSelected: true,
    },
    {
      field: "$createdAt",
      header: "Created At",
      dataType: DataType.dateTime,
      isSelected: false,
    },
    {
      field: "$updatedAt",
      header: "Updated At",
      dataType: DataType.dateTime,
      isSelected: false,
    },
  ];

  const search = () => {
    const queries = [];

    if (selectedPatient) {
      queries.push(Query.equal("Patients", selectedPatient.$id));
    }

    if (selectedDoctor) {
      queries.push(Query.equal("Doctors", selectedDoctor.$id));
    }

    getAppointments(queries);
  };

  const getAppointments = (queries = []) => {
    setLoading(true);
    appointmentService.getAppointments(queries).then((res) => {
      if (res.documents) {
        setAppointments(res.documents);
        setLoading(false);
      }
    });
  };

  const getMedicalRecords = (queries = []) => {
    medicalRecordService.getMedicalRecords(queries).then((res) => {
      if (res.documents) {
        setSelectedRecord(res.documents[0]);
      }
    });
  };

  const createMedicalRecord = () => {
    setShowCreateField(true);
  };

  useEffect(() => {
    if (switchData?.Id) {
      const query = switchData?.Id ? [Query.equal("Id", switchData?.Id)] : [];
      getMedicalRecords(query);
    } else {
      patientService.getPatients([]).then((res) => {
        if (res.documents) {
          setPatients(res.documents);
        }
      });

      doctorService.getDoctors([]).then((res) => {
        if (res.documents) {
          setDoctors(res.documents);
        }
      });
    }
  }, [switchData?.Id]);

  const actionFields = [{ functionRef: createMedicalRecord, label: "Create" }];

  const navigateBack = () => {
    dispatch(switchPage({ pageIndex: PageSwitch.ViewPage, switchData: null }));
  };

  return (
    <div className="flex flex-col min-h-screen flex-1">
      <div className="flex justify-between items-center ml-5 mr-5 mb-5">
        <Button
          className="mt-2"
          onClickEvent={navigateBack}
          isLoading={loading}
        >
          Go Back
        </Button>
      </div>

      {pageIndex === PageSwitch.CreatePage ? (
        <>
          <div className="flex justify-center mb-3">
            <div className="w-11/12 flex gap-2">
              <div className="w-full md:w-3/12">
                <PRAutoComplete
                  items={doctors}
                  selectedItem={selectedDoctor}
                  setSelectedItem={setSelectedDoctor}
                  property="Name"
                  label="Doctor"
                />
              </div>

              <div className="w-full md:w-3/12">
                <PRAutoComplete
                  items={patients}
                  selectedItem={selectedPatient}
                  setSelectedItem={setSelectedPatient}
                  property="Name"
                  label="Patient"
                />
              </div>

              <div className="w-full md:w-3/12">
                <Button onClickEvent={search} className="mt-7">
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
              <PRDataTable
                value={appointments}
                loading={loading}
                cols={cols}
                actions={actionFields}
              />
            </div>
          </div>
        </>
      ) : null}

      {showCreateField ? (
        <>
          <div className="flex flex-row items-center justify-center px-6 py-2">
            <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg md:mt-0 sm:max-w-2xl xl:p-0 border border-gray-300 shadow-xl shadow-cyan-200">
              <div className="w-10/12 p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create Medical Record
                </h1>
                {/* <form onSubmit={handleSubmit(submitForm)} action="#">
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 px-2">
                      <PRAutoComplete
                        items={departments}
                        selectedItem={selectedDepartment}
                        setSelectedItem={setSelectedDepartment}
                        property="Name"
                        label="Department"
                      />
                    </div>

                    <div className="w-full md:w-1/2 px-2">
                      <Input
                        label="Name"
                        placeholder="Enter Doctor Name"
                        className="mb-4"
                        {...register("Name", { required: true })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 px-2">
                      <Input
                        label="Mobile"
                        placeholder="Enter Mobile"
                        className="mb-4"
                        {...register("Mobile", { required: true })}
                      />
                    </div>

                    <div className="w-full md:w-1/2 px-2">
                      <Input
                        label="Specialization"
                        placeholder="Enter Specialization"
                        className="mb-4"
                        {...register("Specialization", { required: true })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap">
                    <div className="w-2/3 px-2 mx-auto">
                      <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                      >
                        {switchData ? "Update" : "Submit"}
                      </Button>
                    </div>
                  </div>
                </form> */}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CreateOrEditMedicalRecord;
