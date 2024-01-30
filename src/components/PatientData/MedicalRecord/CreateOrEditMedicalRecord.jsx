/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import patientService from "../../../appwrite/patient.service";
import doctorService from "../../../appwrite/doctor.service";
import medicineService from "../../../appwrite/medicine.service";
import appointmentService from "../../../appwrite/appointment.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from "../../../store/pageSwitchSlice";
import { Query } from "appwrite";
import { Icons } from "../../../shared/AppEnum";
import {
  PRDataTable,
  PRAutoComplete,
  Button,
  TextEditor,
  Input,
  IconBtn,
} from "../../index";
import { notify } from "../../../shared/Utility";
import medicalRecordService from "../../../appwrite/medicalrecord.service";
import { useForm } from "react-hook-form";

const CreateOrEditMedicalRecord = () => {
  const dispatch = useDispatch();
  const switchData = useSelector((state) => state.pageSwitch.switchData);
  const pageIndex = useSelector((state) => state.pageSwitch.pageIndex);

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(undefined);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(undefined);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(undefined);

  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(undefined);

  // const [selectedRecord, setSelectedRecord] = useState(undefined);
  const [showCreateField, setShowCreateField] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);

  const [dosage, setDosage] = useState("");

  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      $id: switchData?.$id || null,
      Symptoms: switchData?.Symptoms || "",
      Diagnosis: switchData?.Diagnosis || "",
    },
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
        medicalRecordService
          .updateMedicalRecord(switchData.$id, {
            ...data,
            PatientId: selectedPatient.$id,
            DoctorId: selectedDoctor.$id,
            prescriptions,
          })
          .finally(() => setLoading(false))
          .then((res) => {
            if (res) {
              notify.succes("Updated Successfully!");
              dispatch(
                switchPage({ pageIndex: PageSwitch.ViewPage, switchData: res })
              );
            }
          });
      } else {
        medicalRecordService
          .createMedicalRecord({
            ...data,
            PatientId: selectedPatient.$id,
            DoctorId: selectedDoctor.$id,
            AppointmentId: selectedAppointment.$id,
            prescriptions,
          })
          .finally(() => setLoading(false))
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
      notify.error();
    }
  };

  const createMedicalRecord = (rowData) => {
    setSelectedAppointment(rowData);
    setShowCreateField(true);
  };

  const removeMedicine = (rowData) => {
    const newPrec = prescriptions.filter(
      (item) => item.Medicine.$id !== rowData.Medicine.$id
    );
    setPrescriptions([...newPrec]);
  };

  const addMedicineToList = () => {
    setPrescriptions((prev) => [
      ...prev,
      { Medicine: selectedMedicine, Dosage: dosage },
    ]);

    setSelectedMedicine(undefined);
    setDosage("");
  };

  const isFormValid = () => {
    return selectedPatient && selectedDoctor;
  };

  useEffect(() => {
    medicineService.getMedicines([]).then((res) => {
      if (res.documents) {
        setMedicines(res.documents);
      }
    });

    if (switchData) {
      setSelectedPatient(switchData.Patients);
      setSelectedDoctor(switchData.Doctors);
      setSelectedAppointment(switchData.Appointments);
      switchData.prescriptions.forEach((item) => {
        setPrescriptions((prev) => [
          ...prev,
          { Medicine: item.Medicines, Dosage: item.Dosage },
        ]);
      });

      setShowCreateField(true);
    } else {
      patientService.getPatients([]).then((res) => {
        if (res.documents) {
          setPatients(res.documents);
          if (switchData) {
            setSelectedPatient(
              res.documents.find(
                (item) => item.$id === switchData?.Patients.$id
              )
            );
          }
        }
      });

      doctorService.getDoctors([]).then((res) => {
        if (res.documents) {
          setDoctors(res.documents);
          if (switchData) {
            setSelectedDoctor(
              res.documents.find((item) => item.$id === switchData?.Doctors.$id)
            );
          }
        }
      });
    }
  }, [switchData]);

  const actionFields = [
    { functionRef: createMedicalRecord, icon: Icons.create },
  ];

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

      <div className="flex justify-center mb-3">
        <div className="w-11/12 flex gap-2">
          <div className="w-full md:w-3/12">
            <PRAutoComplete
              items={doctors}
              selectedItem={selectedDoctor}
              setSelectedItem={setSelectedDoctor}
              property="Name"
              label="Doctor"
              disabled={
                appointments.length > 0 || pageIndex === PageSwitch.EditPage
              }
            />
          </div>

          <div className="w-full md:w-3/12">
            <PRAutoComplete
              items={patients}
              selectedItem={selectedPatient}
              setSelectedItem={setSelectedPatient}
              property="Name"
              label="Patient"
              disabled={
                appointments.length > 0 || pageIndex === PageSwitch.EditPage
              }
            />
          </div>

          {pageIndex === PageSwitch.CreatePage ? (
            <div className="w-full md:w-3/12">
              <Button
                onClickEvent={search}
                className="mt-7"
                disabled={!isFormValid()}
              >
                Search
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {pageIndex === PageSwitch.CreatePage ? (
        <div className="flex justify-center">
          <div className="w-11/12 p-5 border border-gray-300 rounded overflow-x-auto mx-auto">
            <PRDataTable
              value={appointments}
              loading={loading}
              cols={cols}
              actions={actionFields}
              headerText="Appointments"
            />
          </div>
        </div>
      ) : null}

      {showCreateField ? (
        <>
          <div className="flex justify-center mt-3">
            <div className="w-11/12 flex flex-col shadow-md shadow-cyan-200 border border-gray-300 rounded-md">
              <h1 className="text-xl p-3 mx-auto text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-2">
                Create Medical Record
              </h1>

              <form onSubmit={handleSubmit(submit)}>
                <div className="mb-4 w-full p-2">
                  <TextEditor
                    label="Symptoms"
                    name="Symptoms"
                    control={control}
                    defaultValue={getValues("Symptoms")}
                  />
                </div>

                <div className="mb-4 w-full p-2">
                  <TextEditor
                    label="Diagnosis"
                    name="Diagnosis"
                    control={control}
                    defaultValue={getValues("Diagnosis")}
                  />
                </div>

                <div className="mb-4 w-full p-2 flex flex-row gap-2">
                  <PRAutoComplete
                    items={medicines}
                    selectedItem={selectedMedicine}
                    setSelectedItem={setSelectedMedicine}
                    property="Name"
                    label="Medicine"
                  />

                  <Input
                    label="Dosage"
                    placeholder="Enter Dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />

                  <IconBtn
                    icon={Icons.create}
                    onClickEvent={addMedicineToList}
                    isLoading={loading}
                    disabled={!selectedMedicine || !dosage}
                  />
                </div>

                {medicines.length > 0 ? (
                  <div className="mb-1 w-full p-2">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-md">
                            Medicine
                          </th>
                          <th scope="col" className="px-6 py-3 text-md">
                            Dosage
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-md w-2/12"
                          ></th>
                        </tr>
                      </thead>

                      <tbody>
                        {prescriptions?.map((item, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            <td className="px-6 py-4">{item.Medicine.Name}</td>
                            <td className="px-6 py-4">{item.Dosage}</td>
                            <td className="px-6 py-4">
                              <IconBtn
                                icon={Icons.delete}
                                onClickEvent={() => removeMedicine(item)}
                                isLoading={loading}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                <div className="mb-4 w-full p-2 flex flex-row justify-center">
                  <Button type="submit" className="w-1/3" isLoading={loading}>
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
