/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';
import { notify } from "../shared/Utility";

export class DiagnosesService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Diagnoses')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createDiagnosis({ DepartmentId, LabAddress, Mobile, Email, Price, Name }) {
        try {
            const diagnosisId = await this.getDiagnosisId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    department: DepartmentId,
                    LabAddress,
                    Mobile,
                    Email,
                    Price,
                    Name,
                    DiagnosisId: diagnosisId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createDiagnosis :: error', error);
        }
    }

    async updateDiagnosis($id, { DepartmentId, LabAddress, Mobile, Email, Price, Name }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    department: DepartmentId,
                    LabAddress,
                    Mobile,
                    Email,
                    Price,
                    Name
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updateDiagnosis :: error', error);
        }
    }

    async deleteDiagnosis($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            notify.error(error.message);
            console.log('Appwrite Service :: deleteDiagnosis :: error', error);
            return false;
        }
    }

    async getDiagnoses(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getDiagnoses :: error', error);
            return false;
        }
    }

    async getDiagnosisId() {
        let diagonId = 0;
        const lastDiagon = await this.getDiagnoses([Query.orderDesc('DiagnosisId'), Query.limit(1)]);
        if (lastDiagon.documents.length > 0) {
            diagonId = lastDiagon.documents[0].DiagnosisId + 1;
        } else {
            diagonId = 1;
        }

        return diagonId;
    }
}

const diagnosesService = new DiagnosesService();

export default diagnosesService;