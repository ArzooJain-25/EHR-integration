import express, { Application } from 'express';
import session from 'express-session';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import appointmentRoutes from './routes/appointment.routes';
import { errorHandler } from './middleware/error.middleware';
import './types/session.types';

const app: Application = express();

// CORS configuration
console.log('Configuring CORS with origin:', config.frontend.url);
app.use(cors({
    origin: [
        config.frontend.url,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000'
    ],
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    name: 'openemr.sid', // Custom session cookie name to avoid conflicts
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to false for local development
        httpOnly: true,
        maxAge: config.session.maxAge,
        sameSite: 'lax', // 'lax' works for same-site redirects
        path: '/',
    },
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// API routes
app.use('/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
