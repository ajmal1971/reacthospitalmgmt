/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class PatientService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Patient')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPatient({ Name, DateOfBirth, Address, Mobile, EmergencyContactNo }) {
        try {
            const patientId = await this.getPatientId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Name,
                    DateOfBirth,
                    Address,
                    Mobile,
                    EmergencyContactNo,
                    PatientId: patientId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createPatient :: error', error);
        }
    }

    async updatePatient($id, { Name, DateOfBirth, Address, Mobile, EmergencyContactNo }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Name,
                    DateOfBirth,
                    Address,
                    Mobile,
                    EmergencyContactNo
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

    async getPatientId() {
        let patId = 0;
        const lastPat = await this.getPatients([Query.orderDesc('PatientId'), Query.limit(1)]);
        if (lastPat.documents.length > 0) {
            patId = lastPat.documents[0].PatientId + 1;
        } else {
            patId = 1;
        }

        return patId;
    }
}

const patientService = new PatientService();

export default patientService;