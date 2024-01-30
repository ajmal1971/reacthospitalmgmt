/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import { getRecordId } from "../shared/Utility";
import prescriptionService from "./prescription.service";

export class MedicalRecordService {
  client = new Client();
  databases;
  storage;
  collectionId = config.appwriteCollectionId
    .split(",")
    .find((pair) => pair.includes("MedicalRecords"))
    .split(":")[1];

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createMedicalRecord({
    PatientId,
    DoctorId,
    Symptoms,
    Diagnosis,
    prescriptions = [],
  }) {
    try {
      const recordId = await getRecordId(this.getMedicalRecords.bind(this));
      const result = await this.databases.createDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        ID.unique(),
        {
          Patients: PatientId,
          Doctors: DoctorId,
          Symptoms,
          Diagnosis,
          Id: recordId,
        }
      );

      if (prescriptions.length > 0) {
        await Promise.all(prescriptions.map(async (item) => {
          await prescriptionService.createPrescription({ MedicalRecordId: result.$id, MedicineId: item.Medicine.$id, Dosage: item.Dosage });
        }));
      }

      return result;
    } catch (error) {
      console.log("Appwrite Service :: createMedicalRecord :: error", error);
    }
  }

  async updateMedicalRecord($id, { PatientId, DoctorId, Symptoms, Diagnosis, prescriptions = [] }) {
    try {
      const result = await prescriptionService.getPrescriptions([Query.equal("MedicalRecords", $id)]);

      //Delete Existing Prescriptions
      if (result && result.documents.length > 0) {
        await Promise.all(
          result.documents.map(async (item) => {
            await prescriptionService.deletePrescription(item.$id);
          })
        );
      }

      //Create New Prescriptions
      if (prescriptions.length > 0) {
        await Promise.all(prescriptions.map(async (item) => {
          await prescriptionService.createPrescription({ MedicalRecordId: $id, MedicineId: item.Medicine.$id, Dosage: item.Dosage });
        }));
      }

      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        $id,
        {
          Patients: PatientId,
          Doctors: DoctorId,
          Symptoms,
          Diagnosis,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: updateMedicalRecord :: error", error);
    }
  }

  async deleteMedicalRecord($id) {
    try {
      const result = await prescriptionService.getPrescriptions([
        Query.equal("MedicalRecords", $id),
      ]);

      if (result && result.documents.length > 0) {
        await Promise.all(
          result.documents.map(async (item) => {
            await prescriptionService.deletePrescription(item.$id);
          })
        );
      }

      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        $id
      );

      return true;
    } catch (error) {
      console.log("Appwrite Service :: deleteMedicalRecord :: error", error);
      return false;
    }
  }

  async getMedicalRecords(quories = []) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        this.collectionId,
        quories
      );
    } catch (error) {
      console.log("Appwrite Service :: getMedicalRecords :: error", error);
      return false;
    }
  }

  async getRecordDetails(recordId) {
    try {
      const medicalRecord = await this.getMedicalRecords([
        Query.equal("$id", recordId),
      ]);
      const prescriptions = await prescriptionService.getPrescriptions([
        Query.equal("MedicalRecords", recordId),
      ]);
      const result = {
        ...medicalRecord.documents[0],
        prescriptions: prescriptions.documents,
      };

      return result;
    } catch (error) {
      console.error("Appwrite Service :: getRecordDetails :: error", error);
      return false;
    }
  }
}

const medicalRecordService = new MedicalRecordService();

export default medicalRecordService;
