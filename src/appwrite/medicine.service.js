/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage } from 'appwrite';
import { getRecordId } from "../shared/Utility";

export class MedicineService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Medicines')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createMedicine({ Name, Description }) {
        try {
            const recordId = await getRecordId(this.getMedicines.bind(this));
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Name,
                    Description,
                    Id: recordId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createMedicine :: error', error);
        }
    }

    async updateMedicine($id, { Name, Description }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Name,
                    Description
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updateMedicine :: error', error);
        }
    }

    async deleteMedicine($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deleteMedicine :: error', error);
            return false;
        }
    }

    async getMedicines(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getMedicines :: error', error);
            return false;
        }
    }
}

const medicineService = new MedicineService();

export default medicineService;