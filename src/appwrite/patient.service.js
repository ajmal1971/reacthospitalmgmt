/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';
import { getRecordId } from "../shared/Utility";

export class PatientService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Patients')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPatient({ Name, DateOfBirth, Mobile }) {
        try {
            const recordId = await getRecordId(this.getPatients.bind(this));
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Name,
                    DateOfBirth,
                    Mobile,
                    Id: recordId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createPatient :: error', error);
        }
    }

    async updatePatient($id, { Name, DateOfBirth, Mobile }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Name,
                    DateOfBirth,
                    Mobile
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updatePatient :: error', error);
        }
    }

    async deletePatient($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deletePatient :: error', error);
            return false;
        }
    }

    async getPatients(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getPatients :: error', error);
            return false;
        }
    }
}

const patientService = new PatientService();

export default patientService;