/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PageSwitch, DataType } from "../../../shared/AppEnum";
import patientService from "../../../appwrite/patient.service";
import doctorService from "../../../appwrite/doctor.service";
import medicalRecordService from "../../../appwrite/medicalrecord.service";
import { useDispatch, useSelector } from "react-redux";
import { switchPage } from "../../../store/pageSwitchSlice";
import { Query } from "appwrite";
import { PRDataTable, PRAutoComplete, Button } from "../../index";
import { notify, confirm } from "../../../shared/Utility";
import { Dialog } from "primereact/dialog";
import DOMPurify from "dompurify";

const ManageMedicalRecord = () => {
  const dispatch = useDispatch();
  const switchData = useSelector((state) => state.pageSwitch.switchData);

  const [loading, setLoading] = useState(false);
  const [medicalrecords, setMedicalRecords] = useState([]);
  const [medicalrecordDetail, setMedicalRecordDetail] = useState();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(undefined);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(undefined);

  const [dialogVisible, setDialogVisible] = useState(false);

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
      field: "Symptoms",
      header: "Symptoms",
      dataType: DataType.string,
      isSelected: false,
    },
    {
      field: "Diagnosis",
      header: "Diagnosis",
      dataType: DataType.string,
      isSelected: false,
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

    getMedicalRecords(queries);
  };

  const getMedicalRecords = (queries = []) => {
    setLoading(true);
    medicalRecordService.getMedicalRecords(queries).then((res) => {
      if (res.documents) {
        setMedicalRecords(res.documents);
        setLoading(false);
      }
    });
  };

  const editMedicalRecord = (rowData) => {
    setLoading(true);
    getMedicalRecordWiseDetail(rowData.$id)
      .finally(() => setLoading(false))
      .then((res) => {
        if (res) {
          dispatch(
            switchPage({ pageIndex: PageSwitch.EditPage, switchData: res })
          );
        }
      });
  };

  const deleteMedicalRecord = async (rowData) => {
    confirm("Are You Sure To Delete This Medical Record?", (isConfirmed) => {
      if (isConfirmed) {
        setLoading(true);
        medicalRecordService
          .deleteMedicalRecord(rowData.$id)
          .finally(() => setLoading(false))
          .then((res) => {
            if (res) {
              notify.succes("Deleted Successfully!");
              getMedicalRecords();
            }
          });
      }
    });
  };

  const showDetailModal = async (rowData) => {
    setLoading(true);
    getMedicalRecordWiseDetail(rowData.$id)
      .finally(() => setLoading(false))
      .then((res) => {
        if (res) {
          setMedicalRecordDetail(res);
          setDialogVisible(true);
        }
      });
  };

  const getMedicalRecordWiseDetail = async ($id) => {
    return await medicalRecordService.getRecordDetails($id);
  };

  useEffect(() => {
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

    if (switchData?.Id) {
      const query = switchData?.Id ? [Query.equal("Id", switchData?.Id)] : [];
      getMedicalRecords(query);
    }
  }, [switchData?.Id]);

  const actionFields = [
    { functionRef: editMedicalRecord, label: "Edit" },
    { functionRef: deleteMedicalRecord, label: "Delete" },
    { functionRef: showDetailModal, label: "Details" },
  ];

  const navigatePage = () => {
    dispatch(
      switchPage({ pageIndex: PageSwitch.CreatePage, switchData: null })
    );
  };

  return (
    <div className="flex flex-col min-h-screen flex-1">
      <div className="flex justify-between items-center ml-5 mr-5 mb-5">
        <h1 className="text-3xl font-bold text-gray-700">
          Manage Medical Records
        </h1>
        <Button className="mt-2" onClickEvent={navigatePage}>
          Create Medical Record
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
            value={medicalrecords}
            loading={loading}
            cols={cols}
            actions={actionFields}
            headerText="Medical Records"
          />
        </div>
      </div>

      <div className="card flex justify-content-center">
        <Dialog
          header="Medical Record Detail"
          visible={dialogVisible}
          style={{ width: "50vw" }}
          onHide={() => setDialogVisible(false)}
        >
          <div className="w-full">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Symptoms
            </label>
            <p className="mb-5 w-full text-gray-700 text-sm">
              {medicalrecordDetail?.Symptoms}
            </p>
          </div>

          <div className="w-full">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Diagnosis
            </label>
            <p
              className="mb-5 w-full text-gray-700 text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(medicalrecordDetail?.Diagnosis),
              }}
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Prescription
            </label>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Medicine
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Dosage
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {medicalrecordDetail?.prescriptions.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">{item.Medicines.Name}</td>
                      <td className="px-6 py-4">{item.Dosage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageMedicalRecord;
