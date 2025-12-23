import { Router, Request, Response } from 'express';
import { FHIRService } from '../services/fhir.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

/**
 * GET /api/appointments
 * Get patient appointments
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const fhirService = new FHIRService(req.session.accessToken!);
        const appointments = await fhirService.getAppointments(req.session.patientId!);

        res.json(appointments);
    } catch (error: any) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            error: {
                code: 'FETCH_ERROR',
                message: 'Failed to fetch appointments',
            },
        });
    }
});

/**
 * POST /api/appointments
 * Create a new appointment
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const appointmentData = req.body;
        const fhirService = new FHIRService(req.session.accessToken!);
        const appointment = await fhirService.createAppointment(appointmentData);

        res.status(201).json(appointment);
    } catch (error: any) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            error: {
                code: 'CREATE_ERROR',
                message: 'Failed to create appointment',
            },
        });
    }
});

export default router;
