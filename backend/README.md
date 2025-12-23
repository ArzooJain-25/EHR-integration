# OpenEMR SMART Backend

Backend API server for OpenEMR SMART on FHIR integration.

## Features

- ✅ OAuth 2.0 with PKCE (Proof Key for Code Exchange)
- ✅ Session-based authentication
- ✅ FHIR API proxy endpoints
- ✅ Patient data retrieval
- ✅ Appointment management
- ✅ Automatic token refresh
- ✅ TypeScript for type safety

## Prerequisites

- Node.js 18+ 
- OpenEMR running on `http://localhost:8080`
- Registered OAuth client

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your OAuth client ID
```

## Configuration

Edit `.env` file:

```bash
OAUTH_CLIENT_ID=your-client-id-here
SESSION_SECRET=your-secret-key-here
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `GET /auth/login` - Initiate OAuth flow
- `GET /auth/callback` - OAuth callback handler
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and clear session
- `GET /auth/status` - Check authentication status

### Patient Data

- `GET /api/patient` - Get patient demographics
- `GET /api/patient/observations` - Get observations (vitals, labs)
- `GET /api/patient/conditions` - Get conditions (diagnoses)
- `GET /api/patient/medications` - Get medications

### Appointments

- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment

### Health Check

- `GET /health` - Server health status

## Usage Flow

1. Navigate to `http://localhost:3001/auth/login`
2. Login to OpenEMR and authorize
3. Get redirected back with session cookie
4. Call API endpoints with session cookie

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment configuration
│   ├── services/
│   │   ├── pkce.service.ts     # PKCE generation
│   │   ├── oauth.service.ts    # OAuth flow handlers
│   │   └── fhir.service.ts     # FHIR API client
│   ├── routes/
│   │   ├── auth.routes.ts      # OAuth endpoints
│   │   ├── patient.routes.ts   # Patient data endpoints
│   │   └── appointment.routes.ts # Appointment endpoints
│   ├── middleware/
│   │   ├── auth.middleware.ts  # Authentication middleware
│   │   └── error.middleware.ts # Error handling
│   ├── types/
│   │   └── session.types.ts    # Session type definitions
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Security

- Session cookies are HTTP-only
- PKCE prevents authorization code interception
- Tokens stored server-side only
- CORS configured for frontend origin only
- Secure cookies in production

## Development

```bash
# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

## Troubleshooting

### "Missing required environment variables"
- Ensure `OAUTH_CLIENT_ID` is set in `.env`

### "Failed to exchange authorization code"
- Check that OpenEMR is running
- Verify client ID is correct
- Ensure redirect URI matches registration

### "CORS error"
- Update `FRONTEND_URL` in `.env` to match your frontend origin

## License

MIT
