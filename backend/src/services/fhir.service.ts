import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env';

/**
 * FHIR Service
 * Client for interacting with OpenEMR FHIR API
 */
export class FHIRService {
    private client: AxiosInstance;

    constructor(accessToken: string) {
        this.client = axios.create({
            baseURL: config.openemr.fhirBaseUrl,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/fhir+json',
                'Content-Type': 'application/fhir+json',
            },
        });
    }

    /**
     * Get patient demographics
     * @param patientId - Patient ID
     * @returns Patient resource
     */
    async getPatient(patientId: string): Promise<any> {
        try {
            const response = await this.client.get(`/Patient/${patientId}`);
            return response.data;
        } catch (error: any) {
            console.error('Get patient error:', error.response?.data || error.message);
            throw new Error('Failed to fetch patient data');
        }
    }

    /**
     * Get patient observations (vital signs, lab results)
     * @param patientId - Patient ID
     * @param category - Optional category filter (e.g., 'vital-signs')
     * @returns Bundle of observations
     */
    async getObservations(patientId: string, category?: string): Promise<any> {
        try {
            const params: any = { patient: patientId, _count: 100 };
            if (category) {
                params.category = category;
            }

            const response = await this.client.get('/Observation', { params });
            return response.data;
        } catch (error: any) {
            console.error('Get observations error:', error.response?.data || error.message);
            throw new Error('Failed to fetch observations');
        }
    }

    /**
     * Get patient conditions (diagnoses)
     * @param patientId - Patient ID
     * @returns Bundle of conditions
     */
    async getConditions(patientId: string): Promise<any> {
        try {
            const response = await this.client.get('/Condition', {
                params: { patient: patientId },
            });
            return response.data;
        } catch (error: any) {
            console.error('Get conditions error:', error.response?.data || error.message);
            throw new Error('Failed to fetch conditions');
        }
    }

    /**
     * Get patient medication requests
     * @param patientId - Patient ID
     * @returns Bundle of medication requests
     */
    async getMedications(patientId: string): Promise<any> {
        try {
            const response = await this.client.get('/MedicationRequest', {
                params: { patient: patientId },
            });
            return response.data;
        } catch (error: any) {
            console.error('Get medications error:', error.response?.data || error.message);
            throw new Error('Failed to fetch medications');
        }
    }

    /**
     * Get patient allergies
     * @param patientId - Patient ID
     * @returns Bundle of allergies
     */
    async getAllergies(patientId: string): Promise<any> {
        try {
            console.log(`Fetching allergies for patient: ${patientId} from ${this.client.defaults.baseURL}/AllergyIntolerance`);
            const response = await this.client.get('/AllergyIntolerance', {
                params: { patient: patientId },
            });
            return response.data;
        } catch (error: any) {
            console.error('Get allergies error:', error.response?.data || error.message);
            throw new Error('Failed to fetch allergies');
        }
    }

    /**
     * Get patient appointments
     * @param patientId - Patient ID
     * @returns Bundle of appointments
     */
    async getAppointments(patientId: string): Promise<any> {
        try {
            const response = await this.client.get('/Appointment', {
                params: { patient: patientId },
            });
            return response.data;
        } catch (error: any) {
            console.error('Get appointments error:', error.response?.data || error.message);
            throw new Error('Failed to fetch appointments');
        }
    }

    /**
     * Create a new appointment
     * @param appointmentData - FHIR Appointment resource
     * @returns Created appointment
     */
    async createAppointment(appointmentData: any): Promise<any> {
        try {
            const response = await this.client.post('/Appointment', appointmentData);
            return response.data;
        } catch (error: any) {
            console.error('Create appointment error:', error.response?.data || error.message);
            throw new Error('Failed to create appointment');
        }
    }
}
