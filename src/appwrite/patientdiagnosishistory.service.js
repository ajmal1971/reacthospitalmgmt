/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class PatientDiagnosisHistoryService {
    client = new Client();
    databases;
    storage;
    collectionId = null;// config.appwriteCollectionId.split(',').find(pair => pair.includes('PatientDiagnosisHistory')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPatientDiagnosisHistory({ PatientHistoryId, DiagnosisId, Date, Note }) {
        try {
            const rowId = await this.getRowId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    patientHistory: PatientHistoryId,
                    diagnoses: DiagnosisId,
                    Date,
                    Note,
                    PatientDiagnosisHistoryId: rowId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createPatientDiagnosisHistory :: error', error);
        }
    }

    async updatePatientDiagnosisHistory($id, { PatientHistoryId, DiagnosisId, Date, Note }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    patientHistory: PatientHistoryId,
                    diagnoses: DiagnosisId,
                    Date,
                    Note
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updatePatientDiagnosisHistory :: error', error);
        }
    }

    async deletePatientDiagnosisHistory($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePatientDiagnosisHistory :: error', error);
            return false;
        }
    }

    async getPatientDiagnosisHistories(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getPatientDiagnosisHistories :: error', error);
            return false;
        }
    }

    async getRowId() {
        let rowId = 0;
        const lastRow = await this.getPatientDiagnosisHistories([Query.orderDesc('PatientDiagnosisHistoryId'), Query.limit(1)]);
        if (lastRow.documents.length > 0) {
            rowId = lastRow.documents[0].PatientDiagnosisHistoryId + 1;
        } else {
            rowId = 1;
        }

        return rowId;
    }
}

const patientDiagnosisHistoryService = new PatientDiagnosisHistoryService();

export default patientDiagnosisHistoryService;