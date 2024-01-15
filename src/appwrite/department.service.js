/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class DepartmentService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Department')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createDepartment({ Name, Mobile }) {
        try {
            const departmentId = await this.getDepartmentId();
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Name,
                    Mobile,
                    DepartmentId: departmentId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createDepartment :: error', error);
        }
    }

    async updateDepartment($id, { Name, Mobile }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Name,
                    Mobile
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updateDepartment :: error', error);
        }
    }

    async deleteDepartment($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deleteDepartment :: error', error);
            return false;
        }
    }

    async getDepartments(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getDepartments :: error', error);
            return false;
        }
    }

    async getDepartmentId() {
        let deptId = 0;
        const lastDept = await this.getDepartments([Query.orderDesc('DepartmentId'), Query.limit(1)]);
        if (lastDept.documents.length > 0) {
            deptId = lastDept.documents[0].DepartmentId + 1;
        } else {
            deptId = 1;
        }

        return deptId;
    }
}

const departmentService = new DepartmentService();

export default departmentService;