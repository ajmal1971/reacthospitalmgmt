/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage } from 'appwrite';
import { getRecordId } from "../shared/Utility";

export class MedicalRecordService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('MedicalRecords')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createMedicalRecord({ PatientId, DoctorId, Symptoms, Diagnosis }) {
        try {
            const recordId = await getRecordId(this.getMedicalRecords.bind(this));
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Patients: PatientId,
                    Doctors: DoctorId,
                    Symptoms,
                    Diagnosis,
                    Id: recordId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createMedicalRecord :: error', error);
        }
    }

    async updateMedicalRecord($id, { PatientId, DoctorId, Symptoms, Diagnosis }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Patients: PatientId,
                    Doctors: DoctorId,
                    Symptoms,
                    Diagnosis
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updateMedicalRecord :: error', error);
        }
    }

    async deleteMedicalRecord($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deleteMedicalRecord :: error', error);
            return false;
        }
    }

    async getMedicalRecords(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getMedicalRecords :: error', error);
            return false;
        }
    }
}

const medicalRecordService = new MedicalRecordService();

export default medicalRecordService;