/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage } from "appwrite";
import { getRecordId } from "../shared/Utility";

export class TestOrderService {
  client = new Client();
  databases;
  storage;
  collectionId = config.appwriteCollectionId
    .split(",")
    .find((pair) => pair.includes("TestOrders"))
    .split(":")[1];

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createTestOrder({ MedicalRecordId, TestId }) {
    try {
      const recordId = await getRecordId(this.getTestOrders.bind(this));
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        ID.unique(),
        {
          Id: recordId,
          MedicalRecords: MedicalRecordId,
          Tests: TestId,
          TestDone: false,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: createTestOrder :: error", error);
    }
  }

  async updateTestOrder($id, { MedicalRecordId, TestId, TestDone }) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        $id,
        {
          MedicalRecords: MedicalRecordId,
          Tests: TestId,
          TestDone,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: updateTestOrder :: error", error);
    }
  }

  async deleteTestOrder($id) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        $id
      );
      return true;
    } catch (error) {
      console.log("Appwrite Service :: deleteTestOrder :: error", error);
      return false;
    }
  }

  async getTestOrders(quories = []) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        this.collectionId,
        quories
      );
    } catch (error) {
      console.log("Appwrite Service :: getTestOrders :: error", error);
      return false;
    }
  }
}

const testOrderService = new TestOrderService();

export default testOrderService;
