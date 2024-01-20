/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class PatientFollowupHistoryService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('PatientFollowupHistory')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPatientFollowupHistory({ PatientHistoryId, Date, Note }) {
        try {
            const pfhId = await this.getPatientFollowupHistoryId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    patientHistory: PatientHistoryId,
                    Date,
                    Note,
                    PatientFollowupHistoryId: pfhId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createPatientFollowupHistory :: error', error);
        }
    }

    async updatePatientFollowupHistory($id, { PatientHistoryId, Date, Note }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    patientHistory: PatientHistoryId,
                    Date,
                    Note
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updatePatientFollowupHistory :: error', error);
        }
    }

    async deletePatientFollowupHistory($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePatientFollowupHistory :: error', error);
            return false;
        }
    }

    async getPatientFollowupHistories(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getgetPatientFollowupHistories :: error', error);
            return false;
        }
    }

    async getPatientFollowupHistoryId() {
        let pfhId = 0;
        const lastPfh = await this.getPatientFollowupHistories([Query.orderDesc('PatientFollowupHistoryId'), Query.limit(1)]);
        if (lastPfh.documents.length > 0) {
            pfhId = lastPfh.documents[0].PatientFollowupHistoryId + 1;
        } else {
            pfhId = 1;
        }

        return pfhId;
    }
}

const patientFollowupHistoryService = new PatientFollowupHistoryService();

export default patientFollowupHistoryService;