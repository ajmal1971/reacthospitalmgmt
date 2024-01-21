/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';
import { getRecordId } from "../shared/Utility";

export class DoctorService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Doctors')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createDoctor({ Name, DepartmentId, Mobile, Specialization }) {
        try {
            const recordId = await getRecordId(this.getDoctors.bind(this));
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Name,
                    Departments: DepartmentId,
                    Mobile,
                    Specialization,
                    Id: recordId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createDoctor :: error', error);
        }
    }

    async updateDoctor($id, { Name, DepartmentId, Mobile, Specialization }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Name,
                    Departments: DepartmentId,
                    Mobile,
                    Specialization
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
}

const doctorService = new DoctorService();

export default doctorService;