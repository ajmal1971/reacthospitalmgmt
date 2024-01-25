/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage } from 'appwrite';
import { getRecordId } from "../shared/Utility";

export class PrescriptionService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Prescriptions')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPrescription({ MedicalRecordId, MedicineId, Dosage }) {
        try {
            const recordId = await getRecordId(this.getPrescriptions.bind(this));
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    MedicalRecords: MedicalRecordId,
                    Medicines: MedicineId,
                    Dosage,
                    Id: recordId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createPrescription :: error', error);
        }
    }

    async updatePrescription($id, { MedicalRecordId, MedicineId, Dosage }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    MedicalRecords: MedicalRecordId,
                    Medicines: MedicineId,
                    Dosage
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updatePrescription :: error', error);
        }
    }

    async deletePrescription($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePrescription :: error', error);
            return false;
        }
    }

    async getPrescriptions(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getPrescriptions :: error', error);
            return false;
        }
    }
}

const prescriptionService = new PrescriptionService();

export default prescriptionService;