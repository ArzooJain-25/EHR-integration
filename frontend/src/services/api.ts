import axios from 'axios';
import type { AuthStatus, Patient, Bundle, Observation, Condition, MedicationRequest, Appointment, AllergyIntolerance } from '../types/fhir.types';

const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    checkStatus: async (): Promise<AuthStatus> => {
        const response = await api.get<AuthStatus>('/auth/status');
        return response.data;
    },

    login: () => {
        window.location.href = '/auth/login';
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },
};

export const patientAPI = {
    getPatient: async (): Promise<Patient> => {
        const response = await api.get<Patient>('/api/patient');
        return response.data;
    },

    getObservations: async (category?: string): Promise<Bundle<Observation>> => {
        const params = category ? { category } : {};
        const response = await api.get<Bundle<Observation>>('/api/patient/observations', { params });
        return response.data;
    },

    getConditions: async (): Promise<Bundle<Condition>> => {
        const response = await api.get<Bundle<Condition>>('/api/patient/conditions');
        return response.data;
    },

    getMedications: async (): Promise<Bundle<MedicationRequest>> => {
        const response = await api.get<Bundle<MedicationRequest>>('/api/patient/medications');
        return response.data;
    },

    getAllergies: async (): Promise<Bundle<AllergyIntolerance>> => {
        const response = await api.get<Bundle<AllergyIntolerance>>('/api/patient/allergies');
        return response.data;
    },
};

export const appointmentAPI = {
    getAppointments: async (): Promise<Bundle<Appointment>> => {
        const response = await api.get<Bundle<Appointment>>('/api/appointments');
        return response.data;
    },

    createAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
        const response = await api.post<Appointment>('/api/appointments', data);
        return response.data;
    },
};
