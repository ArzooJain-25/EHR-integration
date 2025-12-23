import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    openemr: {
        baseUrl: process.env.OPENEMR_BASE_URL || 'http://localhost:8080',
        fhirBaseUrl: process.env.FHIR_BASE_URL || 'http://localhost:8080/apis/default/fhir',
    },

    oauth: {
        clientId: process.env.OAUTH_CLIENT_ID || '',
        clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
        redirectUri: process.env.OAUTH_REDIRECT_URI || 'http://localhost:3001/auth/callback',
        scopes: process.env.OAUTH_SCOPES || 'launch/patient patient/Patient.read patient/Observation.read patient/Condition.read patient/MedicationRequest.read patient/Appointment.read patient/AllergyIntolerance.read api:fhir offline_access fhirUser openid',
        authorizationUrl: `${process.env.OPENEMR_BASE_URL || 'http://localhost:8080'}/oauth2/default/authorize`,
        tokenUrl: `${process.env.OPENEMR_BASE_URL || 'http://localhost:8080'}/oauth2/default/token`,
    },

    session: {
        secret: process.env.SESSION_SECRET || 'change-this-secret',
        maxAge: parseInt(process.env.SESSION_MAX_AGE || '3600000', 10),
    },

    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
};

// Validate required environment variables
const requiredEnvVars = ['OAUTH_CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}
