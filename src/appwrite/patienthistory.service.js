/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class PatientHistoryService {
    client = new Client();
    databases;
    storage;
    collectionId = null;// config.appwriteCollectionId.split(',').find(pair => pair.includes('PatientHistory')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPatientHistory({ PatientId, DoctorId, Date, Note }) {
        try {
            const patientHistoryId = await this.getPatientHistoryId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    patient: PatientId,
                    doctor: DoctorId,
                    Date,
                    Note,
                    PatientHistoryId: patientHistoryId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createPatientHistory :: error', error);
        }
    }

    async updatePatientHistory($id, { PatientId, DoctorId, Date, Note }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    patient: PatientId,
                    doctor: DoctorId,
                    Date,
                    Note
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updatePatientHistory :: error', error);
        }
    }

    async deletePatientHistory($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePatientHistory :: error', error);
            return false;
        }
    }

    async getPatientHistories(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getPatientHistories :: error', error);
            return false;
        }
    }

    async getPatientHistoryId() {
        let phId = 0;
        const lastPh = await this.getPatientHistories([Query.orderDesc('PatientHistoryId'), Query.limit(1)]);
        if (lastPh.documents.length > 0) {
            phId = lastPh.documents[0].PatientHistoryId + 1;
        } else {
            phId = 1;
        }

        return phId;
    }
}

const patientHistoryService = new PatientHistoryService();

export default patientHistoryService;