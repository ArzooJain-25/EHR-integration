import app from './app';
import { config } from './config/env';

const PORT = config.port;

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 OpenEMR SMART Backend Server');
    console.log('========================================');
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('OAuth Endpoints:');
    console.log(`  Login: http://localhost:${PORT}/auth/login`);
    console.log(`  Callback: ${config.oauth.redirectUri}`);
    console.log(`  Status: http://localhost:${PORT}/auth/status`);
    console.log('');
    console.log('API Endpoints:');
    console.log(`  Patient: http://localhost:${PORT}/api/patient`);
    console.log(`  Observations: http://localhost:${PORT}/api/patient/observations`);
    console.log(`  Conditions: http://localhost:${PORT}/api/patient/conditions`);
    console.log(`  Medications: http://localhost:${PORT}/api/patient/medications`);
    console.log(`  Appointments: http://localhost:${PORT}/api/appointments`);
    console.log('========================================');
});
