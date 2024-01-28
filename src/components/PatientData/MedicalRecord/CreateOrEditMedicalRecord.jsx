/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import patientService from "../../../appwrite/patient.service";
import doctorService from "../../../appwrite/doctor.service";
import appointmentService from "../../../appwrite/appointment.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from "../../../store/pageSwitchSlice";
import { Query } from "appwrite";
import { PRDataTable, PRAutoComplete, Button, TextArea, TextEditor } from "../../index";
import { notify, confirm } from "../../../shared/Utility";
import medicalRecordService from "../../../appwrite/medicalrecord.service";
import { useForm } from "react-hook-form";

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

  const { register, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      $id: switchData?.$id || null,
      Symptoms: switchData?.Symptoms || '',
      Diagnosis: switchData?.Diagnosis || 'active'
    }
  });

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

  const submit = async (data) => {
    setLoading(true);
    try {
      if (switchData) {
        medicalRecordService.updateMedicalRecord(switchData.$id, { ...data, PatientId: selectedPatient.$id, DoctorId: selectedDoctor.$id })
          .finally(() => setLoading(false))
          .then(res => {
            if (res) {
              notify.succes('Updated Successfully!');
              dispatch(switchPage({ pageIndex: PageSwitch.ViewPage, switchData: res }));
            }
          });
      } else {
        medicalRecordService.createMedicalRecord({ ...data, PatientId: selectedPatient.$id, DoctorId: selectedDoctor.$id })
          .finally(() => setLoading(false))
          .then(res => {
            if (res) {
              notify.succes('Created Successfully!');
              dispatch(switchPage({ pageIndex: PageSwitch.ViewPage, switchData: res }));
            }
          });
      }
    }
    catch (error) {
      notify.error();
    }
  }

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
          if (switchData) {
            setSelectedPatient(res.documents.find(item => item.$id === switchData?.Patients.$id));
          }
        }
      });

      doctorService.getDoctors([]).then((res) => {
        if (res.documents) {
          setDoctors(res.documents);
          if (switchData) {
            setSelectedDoctor(res.documents.find(item => item.$id === switchData?.Doctors.$id));
          }
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
          <div className="flex justify-center mt-3">
            <div className="w-10/12 flex flex-col shadow-md shadow-cyan-200 border border-gray-300 rounded-md">
              <h1 className="text-xl p-3 mx-auto text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-2">
                Create Medical Record
              </h1>

              <form onSubmit={handleSubmit(submit)}>
                <div className="mb-4 w-full p-2">
                  <TextArea
                    label="Symptoms"
                    placeholder="Enter Symptoms"
                    {...register("Symptoms", { required: true })}
                  />
                </div>

                <div className="mb-4 w-full p-2">
                  <TextEditor label="Diagnosis" name="content" control={control} defaultValue={getValues("content")} />
                </div>

                <div className="mb-4 w-full p-2">
                  <Button type="submit" className="w-full" isLoading={loading}>
                    {switchData ? "Update" : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CreateOrEditMedicalRecord;
