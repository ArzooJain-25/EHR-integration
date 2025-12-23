import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Bundle, Observation, Condition, MedicationRequest, Appointment, AllergyIntolerance, Patient } from '../../types/fhir.types';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/',
        prepareHeaders: (headers) => {
            // Add any common headers here
            return headers;
        },
        credentials: 'include',
    }),
    tagTypes: ['Medications', 'Allergies', 'Conditions', 'Observations', 'Appointments', 'Patient'],
    endpoints: (builder) => ({
        getPatient: builder.query<Patient, void>({
            query: () => '/api/patient',
            providesTags: ['Patient'],
        }),
        getMedications: builder.query<Bundle<MedicationRequest>, void>({
            query: () => '/api/patient/medications',
            providesTags: ['Medications'],
        }),
        getAllergies: builder.query<Bundle<AllergyIntolerance>, void>({
            query: () => '/api/patient/allergies',
            providesTags: ['Allergies'],
        }),
        getConditions: builder.query<Bundle<Condition>, void>({
            query: () => '/api/patient/conditions',
            providesTags: ['Conditions'],
        }),
        getObservations: builder.query<Bundle<Observation>, string | void>({
            query: (category) => ({
                url: '/api/patient/observations',
                params: category ? { category } : {},
            }),
            providesTags: ['Observations'],
        }),
        getAppointments: builder.query<Bundle<Appointment>, void>({
            query: () => '/api/appointments',
            providesTags: ['Appointments'],
        }),
    }),
});

export const {
    useGetPatientQuery,
    useGetMedicationsQuery,
    useGetAllergiesQuery,
    useGetConditionsQuery,
    useGetObservationsQuery,
    useGetAppointmentsQuery,
} = apiSlice;
