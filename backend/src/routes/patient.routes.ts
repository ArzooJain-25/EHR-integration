import { Router, Request, Response } from 'express';
import { FHIRService } from '../services/fhir.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

/**
 * GET /api/patient
 * Get current patient demographics
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const fhirService = new FHIRService(req.session.accessToken!);
        const patient = await fhirService.getPatient(req.session.patientId!);

        res.json(patient);
    } catch (error: any) {
        console.error('Get patient error:', error);
        res.status(500).json({
            error: {
                code: 'FETCH_ERROR',
                message: 'Failed to fetch patient data',
            },
        });
    }
});

/**
 * GET /api/patient/observations
 * Get patient observations (vital signs, lab results)
 */
router.get('/observations', async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        const fhirService = new FHIRService(req.session.accessToken!);
        const observations = await fhirService.getObservations(
            req.session.patientId!,
            category as string | undefined
        );

        res.json(observations);
    } catch (error: any) {
        console.error('Get observations error:', error);
        res.status(500).json({
            error: {
                code: 'FETCH_ERROR',
                message: 'Failed to fetch observations',
            },
        });
    }
});

/**
 * GET /api/patient/conditions
 * Get patient conditions (diagnoses)
 */
router.get('/conditions', async (req: Request, res: Response) => {
    try {
        const fhirService = new FHIRService(req.session.accessToken!);
        const conditions = await fhirService.getConditions(req.session.patientId!);

        res.json(conditions);
    } catch (error: any) {
        console.error('Get conditions error:', error);
        res.status(500).json({
            error: {
                code: 'FETCH_ERROR',
                message: 'Failed to fetch conditions',
            },
        });
    }
});

/**
 * GET /api/patient/medications
 * Get patient medications
 */
router.get('/medications', async (req: Request, res: Response) => {
    try {
        const fhirService = new FHIRService(req.session.accessToken!);
        const medications = await fhirService.getMedications(req.session.patientId!);

        res.json(medications);
    } catch (error: any) {
        console.error('Get medications error:', error);
        res.status(500).json({
            error: {
                code: 'FETCH_ERROR',
                message: 'Failed to fetch medications',
            },
        });
    }
});

/**
 * GET /api/patient/allergies
 * Get patient allergies
 */
router.get('/allergies', async (req: Request, res: Response) => {
    try {
        const fhirService = new FHIRService(req.session.accessToken!);
        const allergies = await fhirService.getAllergies(req.session.patientId!);

        res.json(allergies);
    } catch (error: any) {
        console.error('Get allergies error:', error.response?.data || error);
        res.status(500).json({
            error: {
                code: 'FETCH_ERROR',
                message: 'Failed to fetch allergies',
            },
        });
    }
});

export default router;
