/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class DoctorService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Doctor')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createDoctor({ DoctorName, DepartmentId, Mobile, Speciality, VisitPrice }) {
        try {
            const doctorId = await this.getDoctorId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    department: DepartmentId,
                    Mobile,
                    VisitPrice,
                    DoctorName,
                    Speciality,
                    DoctorId: doctorId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createDoctor :: error', error);
        }
    }

    async updateDoctor($id, { DoctorName, DepartmentId, Mobile, Speciality, VisitPrice }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    department: DepartmentId,
                    Mobile,
                    VisitPrice,
                    DoctorName,
                    Speciality
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updateDoctor :: error', error);
        }
    }

    async deleteDoctor($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deleteDoctor :: error', error);
            return false;
        }
    }

    async getDoctors(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getDoctors :: error', error);
            return false;
        }
    }

    async getDoctorId() {
        let docId = 0;
        const lastDoc = await this.getDoctors([Query.orderDesc('DoctorId'), Query.limit(1)]);
        if (lastDoc.documents.length > 0) {
            docId = lastDoc.documents[0].DoctorId + 1;
        } else {
            docId = 1;
        }

        return docId;
    }
}

const doctorService = new DoctorService();

export default doctorService;