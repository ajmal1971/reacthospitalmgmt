/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage } from "appwrite";
import { getRecordId } from "../shared/Utility";

export class TestService {
  client = new Client();
  databases;
  storage;
  collectionId = config.appwriteCollectionId
    .split(",")
    .find((pair) => pair.includes("Tests"))
    .split(":")[1];

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createTest({ Name, Description, Cost }) {
    try {
      const recordId = await getRecordId(this.getTests.bind(this));
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        ID.unique(),
        {
          Id: recordId,
          Name,
          Description,
          Cost,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: createTest :: error", error);
    }
  }

  async updateTest($id, { Name, Description, Cost }) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        $id,
        {
          Name,
          Description,
          Cost,
        }
      );
    } catch (error) {
      console.log("Appwrite Service :: updateTest :: error", error);
    }
  }

  async deleteTest($id) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        this.collectionId,
        $id
      );
      return true;
    } catch (error) {
      console.log("Appwrite Service :: deleteTest :: error", error);
      return false;
    }
  }

  async getTests(quories = []) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        this.collectionId,
        quories
      );
    } catch (error) {
      console.log("Appwrite Service :: getTests :: error", error);
      return false;
    }
  }
}

const testService = new TestService();

export default testService;
