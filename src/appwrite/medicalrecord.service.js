/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import { getRecordId } from "../shared/Utility";
import prescriptionService from "./prescription.service";
import testOrderService from "./testorder.service";

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
    AppointmentId,
    Symptoms,
    Diagnosis,
    prescriptions = [],
    testOrders = [],
  }) {
    try {
      const recordId = await getRecordId(this.getListDocuments.bind(this));
      const result = await this.databases.createDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        ID.unique(),
        {
          Patients: PatientId,
          Doctors: DoctorId,
          Appointments: AppointmentId,
          Symptoms,
          Diagnosis,
          Id: recordId,
        }
      );

      if (prescriptions.length > 0) {
        await Promise.all(
          prescriptions.map(async (item) => {
            await prescriptionService.createPrescription({
              MedicalRecordId: result.$id,
              MedicineId: item.Medicine.$id,
              Dosage: item.Dosage,
            });
          })
        );
      }

      if (testOrders.length > 0) {
        await Promise.all(
          testOrders.map(async (item) => {
            await testOrderService.createTestOrder({
              MedicalRecordId: result.$id,
              TestId: item.$id,
            });
          })
        );
      }

      return result;
    } catch (error) {
      console.log("Appwrite Service :: createMedicalRecord :: error", error);
    }
  }

  async updateMedicalRecord(
    $id,
    {
      PatientId,
      DoctorId,
      Symptoms,
      Diagnosis,
      prescriptions = [],
      testOrders = [],
    }
  ) {
    try {
      const prescrips = await prescriptionService.getPrescriptions([
        Query.equal("MedicalRecords", $id),
      ]);

      const tests = await testOrderService.getTestOrders([
        Query.equal("MedicalRecords", $id),
      ]);

      //Delete Existing Prescriptions
      if (prescrips && prescrips.documents.length > 0) {
        await Promise.all(
          prescrips.documents.map(async (item) => {
            await prescriptionService.deletePrescription(item.$id);
          })
        );
      }

      //Delete Existing Test Orders
      if (tests && tests.documents.length > 0) {
        await Promise.all(
          tests.documents.map(async (item) => {
            await testOrderService.deleteTestOrder(item.$id);
          })
        );
      }

      //Create New Prescriptions
      if (prescriptions.length > 0) {
        await Promise.all(
          prescriptions.map(async (item) => {
            await prescriptionService.createPrescription({
              MedicalRecordId: $id,
              MedicineId: item.Medicine.$id,
              Dosage: item.Dosage,
            });
          })
        );
      }

      //Create New Test Orders
      if (testOrders.length > 0) {
        await Promise.all(
          testOrders.map(async (item) => {
            await testOrderService.createTestOrder({
              MedicalRecordId: $id,
              TestId: item.$id,
            });
          })
        );
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
      const prescriptions = await prescriptionService.getPrescriptions([
        Query.equal("MedicalRecords", $id),
      ]);

      const testOrders = await testOrderService.getTestOrders([
        Query.equal("MedicalRecords", $id),
      ]);

      if (prescriptions && prescriptions.documents.length > 0) {
        await Promise.all(
          prescriptions.documents.map(async (item) => {
            await prescriptionService.deletePrescription(item.$id);
          })
        );
      }

      if (testOrders && testOrders.documents.length > 0) {
        await Promise.all(
          testOrders.documents.map(async (item) => {
            await testOrderService.deleteTestOrder(item.$id);
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

  async getListDocuments(quories = []) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        this.collectionId,
        quories
      );
    } catch (error) {
      console.log("Appwrite Service :: getListDocuments :: error", error);
      return false;
    }
  }

  async getMedicalRecords(quories = []) {
    try {
      var records = [];
      const response = await this.getListDocuments(quories);
      response.documents.forEach((item) => {
        records.push({
          $id: item.$id,
          $createdAt: item.$createdAt,
          $updatedAt: item.$updatedAt,
          Id: item.Id,
          Diagnosis: item.Diagnosis,
          Symptoms: item.Symptoms,
          Doctor: item.Doctors.Name,
          Patient: item.Patients.Name,
          AppointmentDate: item.Appointments.AppointmentDate,
        });
      });

      return records;
    } catch (error) {
      console.log("Appwrite Service :: getMedicalRecords :: error", error);
      return false;
    }
  }

  async getRecordDetails(recordId) {
    try {
      const medicalRecord = await this.getListDocuments([
        Query.equal("$id", recordId),
      ]);

      const prescriptions = await prescriptionService.getPrescriptions([
        Query.equal("MedicalRecords", recordId),
      ]);

      const testOrders = await testOrderService.getTestOrders([
        Query.equal("MedicalRecords", recordId),
      ]);

      const result = {
        ...medicalRecord.documents[0],
        prescriptions: prescriptions.documents,
        testOrders: testOrders.documents,
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
