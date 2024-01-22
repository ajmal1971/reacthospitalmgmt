/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage } from 'appwrite';
import { notify } from "../shared/Utility";
import { getRecordId } from "../shared/Utility";

export class DepartmentService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Departments')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createDepartment({ Name, Description }) {
        try {
            const recordId = await getRecordId(this.getDepartments.bind(this)); //bind(this) referance to the instance of DepartmentService class while calling from outside.
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Name,
                    Description,
                    Id: recordId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createDepartment :: error', error);
        }
    }

    async updateDepartment($id, { Name, Description }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Name,
                    Description
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
            notify.error(error.message);
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
}

const departmentService = new DepartmentService();

export default departmentService;