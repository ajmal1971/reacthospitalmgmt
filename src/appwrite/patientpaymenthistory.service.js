/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';
import patientBillService from "./patientbill.service";

export class PatientPaymentHistoryService {
    client = new Client();
    databases;
    storage;
    collectionId = null; //config.appwriteCollectionId.split(',').find(pair => pair.includes('PatientPaymentHistory')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPatientPaymentHistory({ PatientBillId, PaymentDate, Amount, Note }) {
        try {
            const rowId = await this.getRowId();
            const paymentHistory = await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    patientBill: PatientBillId,
                    PaymentDate,
                    Amount,
                    Note,
                    PatientPaymentHistoryId: rowId
                }
            );

            var patientBill = await patientBillService.getPatientBills(Query.equal('$id', PatientBillId));
            var billPaymentHistories = this.getPatientPaymentHistories(Query.equal("patientBill", PatientBillId));

            if (patientBill.documents[0].PatientPayable === billPaymentHistories.documents.reduce((sum, curr) => sum + curr.Amount, 0)) {
                await this.updatePatientBill(patientBill.documents[0].$id, { PatientPaid: true });
            }

            return paymentHistory;
        } catch (error) {
            console.log('Appwrite Service :: createPatientPaymentHistory :: error', error);
        }
    }

    async updatePatientPaymentHistory($id, { PatientBillId, PaymentDate, Amount, Note }) {
        try {
            const paymentHistory = await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    patientBill: PatientBillId,
                    PaymentDate,
                    Amount,
                    Note
                }
            );

            var patientBill = await patientBillService.getPatientBills(Query.equal('$id', PatientBillId));
            var billPaymentHistories = this.getPatientPaymentHistories(Query.equal("patientBill", PatientBillId));

            if (patientBill.documents[0].PatientPayable === billPaymentHistories.documents.reduce((sum, curr) => sum + curr.Amount, 0)) {
                await this.updatePatientBill(patientBill.documents[0].$id, { PatientPaid: true });
            } else {
                await this.updatePatientBill(patientBill.documents[0].$id, { PatientPaid: false });
            }

            return paymentHistory;
        } catch (error) {
            console.log('Appwrite Service :: updatePatientPaymentHistory :: error', error);
        }
    }

    async deletePatientPaymentHistory($id, PatientBillId) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            await this.updatePatientBill(PatientBillId, { PatientPaid: false });
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePatientPaymentHistory :: error', error);
            return false;
        }
    }

    async getPatientPaymentHistories(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getPatientPaymentHistories :: error', error);
            return false;
        }
    }

    async getRowId() {
        let rowId = 0;
        const lastRow = await this.getPatientPaymentHistories([Query.orderDesc('PatientPaymentHistoryId'), Query.limit(1)]);
        if (lastRow.documents.length > 0) {
            rowId = lastRow.documents[0].PatientPaymentHistoryId + 1;
        } else {
            rowId = 1;
        }

        return rowId;
    }
}

const patientPaymentHistoryService = new PatientPaymentHistoryService();

export default patientPaymentHistoryService;