export interface AuthStatus {
    authenticated: boolean;
    patientId: string | null;
    expiresAt: number | null;
}

export interface Patient {
    resourceType: 'Patient';
    id: string;
    name?: Array<{
        given?: string[];
        family?: string;
    }>;
    birthDate?: string;
    gender?: string;
    telecom?: Array<{
        system?: string;
        value?: string;
    }>;
}

export interface Observation {
    resourceType: 'Observation';
    id: string;
    code?: {
        coding?: Array<{
            system?: string;
            code?: string;
            display?: string;
        }>;
        text?: string;
    };
    valueQuantity?: {
        value?: number;
        unit?: string;
    };
    effectiveDateTime?: string;
    status?: string;
}

export interface Condition {
    resourceType: 'Condition';
    id: string;
    code?: {
        coding?: Array<{
            system?: string;
            code?: string;
            display?: string;
        }>;
        text?: string;
    };
    clinicalStatus?: {
        coding?: Array<{
            system?: string;
            code?: string;
            display?: string;
        }>;
        text?: string;
    };
    verificationStatus?: {
        coding?: Array<{
            system?: string;
            code?: string;
            display?: string;
        }>;
        text?: string;
    };
    onsetDateTime?: string;
    recordedDate?: string;
    onsetString?: string;
}

export interface MedicationRequest {
    resourceType: 'MedicationRequest';
    id: string;
    medicationCodeableConcept?: {
        coding?: Array<{
            system?: string;
            code?: string;
            display?: string;
        }>;
        text?: string;
    };
    dosageInstruction?: Array<{
        text?: string;
    }>;
    status?: string;
    authoredOn?: string;
}

export interface Appointment {
    resourceType: 'Appointment';
    id: string;
    status?: string;
    start?: string;
    end?: string;
    participant?: Array<{
        actor?: {
            display?: string;
        };
    }>;
    description?: string;
}

export interface AllergyIntolerance {
    resourceType: 'AllergyIntolerance';
    id: string;
    text?: {
        div: string;
        status?: string;
    };
    code?: {
        coding?: Array<{
            display?: string;
        }>;
        text?: string;
    };
    clinicalStatus?: {
        coding?: Array<{
            code?: string;
        }>;
    };
    criticality?: string;
    category?: string[];
    reaction?: Array<{
        manifestation?: Array<{
            coding?: Array<{
                display?: string;
            }>;
            text?: string;
        }>;
        severity?: string;
    }>;
    recordedDate?: string;
}

export interface Bundle<T = Patient | Observation | Condition | MedicationRequest | Appointment | AllergyIntolerance> {
    resourceType: 'Bundle';
    entry?: Array<{
        resource?: T;
    }>;
    total?: number;
}


