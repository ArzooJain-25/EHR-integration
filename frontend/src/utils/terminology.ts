/**
 * Terminology Utility
 * Maps common medical codes (ICD-10, LOINC, RxNorm) to human-readable names
 * when the FHIR API response doesn't provide a display name.
 */

const TERMINOLOGY_MAP: Record<string, string> = {
    // ICD-10 Conditions
    'H02.839': 'Dermatochalasis',
    'E11.9': 'Type 2 diabetes mellitus without complications',
    'I10': 'Essential (primary) hypertension',
    'J45.909': 'Unspecified asthma, uncomplicated',
    'E78.5': 'Hyperlipidemia',

    // LOINC Observations
    '85354-9': 'Blood Pressure',
    '8867-4': 'Heart Rate',
    '2339-0': 'Glucose',
    '3141-9': 'Body Weight',
    '8302-2': 'Body Height',

    // RxNorm Medications
    '282388': 'Metformin',
    '311354': 'Lisinopril',
    '1191': 'Aspirin',
};

/**
 * Get display name for a code
 * @param code - The medical code
 * @param fallback - Fallback name if code is not found
 * @returns Human-readable name
 */
export const getTerminologyDisplay = (code?: string, fallback: string = 'Unknown'): string => {
    if (!code) return fallback;
    return TERMINOLOGY_MAP[code] || fallback;
};
