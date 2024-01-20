/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class PatientAdmissionHistoryService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('PatientAdmissionHistory')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createAdmissionDateAdmissionDate({ PatientHistoryId, WardNo, BedNo, AdmissionDate }) {
        try {
            const pahId = await this.getPatientAdmissionHistoryId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    patientHistory: PatientHistoryId,
                    WardNo,
                    BedNo,
                    AdmissionDate,
                    PatientAdmissionHistoryId: pahId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createAdmissionDate :: error', error);
        }
    }

    async updatePatientAdmissionHistory($id, { PatientHistoryId, WardNo, BedNo, AdmissionDate }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    patientHistory: PatientHistoryId,
                    WardNo,
                    BedNo,
                    AdmissionDate
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updatePatientAdmissionHistory :: error', error);
        }
    }

    async dischargePatient($id, { DischargeDate, TotalCost, Note }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    DischargeDate,
                    TotalCost,
                    Note
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: dischargePatient :: error', error);
        }
    }

    async deletePatientAdmissionHistory($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePatientAdmissionHistory :: error', error);
            return false;
        }
    }

    async getPatientAdmissionHistories(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getPatientAdmissionHistories :: error', error);
            return false;
        }
    }

    async getPatientAdmissionHistoryId() {
        let rowId = 0;
        const lastRow = await this.getPatientAdmissionHistories([Query.orderDesc('PatientAdmissionHistoryId'), Query.limit(1)]);
        if (lastRow.documents.length > 0) {
            rowId = lastRow.documents[0].PatientAdmissionHistoryId + 1;
        } else {
            rowId = 1;
        }

        return rowId;
    }
}

const patientAdmissionHistoryService = new PatientAdmissionHistoryService();

export default patientAdmissionHistoryService;