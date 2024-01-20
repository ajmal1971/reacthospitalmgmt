/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class PatientBillService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('PatientBill')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPatientBill({ PatientHistoryId, PatientPayable }) {
        try {
            const rowId = await this.getRowId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    patientHistory: PatientHistoryId,
                    PatientPayable,
                    PatientPaid: false,
                    PatientBillId: rowId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createPatientBill :: error', error);
        }
    }

    async updatePatientBill($id, { PatientHistoryId, PatientPayable }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    patientHistory: PatientHistoryId,
                    PatientPayable
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updatePatientBill :: error', error);
        }
    }

    async deletePatientBill($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePatientBill :: error', error);
            return false;
        }
    }

    async getPatientBills(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getPatientBills :: error', error);
            return false;
        }
    }

    async getRowId() {
        let rowId = 0;
        const lastRow = await this.getPatientBills([Query.orderDesc('PatientBillId'), Query.limit(1)]);
        if (lastRow.documents.length > 0) {
            rowId = lastRow.documents[0].PatientBillId + 1;
        } else {
            rowId = 1;
        }

        return rowId;
    }
}

const patientBillService = new PatientBillService();

export default patientBillService;