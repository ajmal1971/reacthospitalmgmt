/* eslint-disable no-useless-catch */
import config from "../config/config";
import { Client, ID, Databases, Storage } from 'appwrite';
import { getRecordId } from "../shared/Utility";

export class AppointmentService {
    client = new Client();
    databases;
    storage;
    collectionId = config.appwriteCollectionId.split(',').find(pair => pair.includes('Appointments')).split(':')[1];

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createAppointment({ PatientId, DoctorId, AppointmentDate }) {
        try {
            const recordId = await getRecordId(this.getAppointments.bind(this));
            return await this.databases.createDocument(config.appwriteDatabaseId, this.collectionId, ID.unique(),
                {
                    Patients: PatientId,
                    Doctors: DoctorId,
                    AppointmentDate,
                    Id: recordId
                }
            );
        } catch (error) {
            console.log('Appwrite Service :: createAppointment :: error', error);
        }
    }

    async updateAppointment($id, { PatientId, DoctorId, AppointmentDate }) {
        try {
            return await this.databases.updateDocument(config.appwriteDatabaseId, this.collectionId, $id,
                {
                    Patients: PatientId,
                    Doctors: DoctorId,
                    AppointmentDate
                }
            )
        } catch (error) {
            console.log('Appwrite Service :: updateAppointment :: error', error);
        }
    }

    async deleteAppointment($id) {
        try {
            await this.databases.deleteDocument(config.appwriteDatabaseId, this.collectionId, $id);
            return true;
        } catch (error) {
            console.log('Appwrite Service :: deleteAppointment :: error', error);
            return false;
        }
    }

    async getAppointments(quories = []) {
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId, this.collectionId, quories);
        } catch (error) {
            console.log('Appwrite Service :: getAppointments :: error', error);
            return false;
        }
    }
}

const appointmentService = new AppointmentService();

export default appointmentService;