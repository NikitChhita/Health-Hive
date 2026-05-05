# HealthHive

HealthHive is a full-stack MERN research project for exploring AI-assisted symptom urgency classification. Users can create an account, submit symptom and health context, receive an AI-generated urgency assessment, and review previous analyses from a protected dashboard.

This project is intended as a research and software engineering prototype, not as a medical product or replacement for professional medical care.

## Features

- AI symptom urgency analysis with Low, Moderate, High, and Emergency ratings
- Urgency score, summary, headline, urgent-care flag, and warning symptom output
- User signup and login with JWT authentication
- Password hashing with bcrypt
- Protected dashboard, symptom checker, history, and settings routes
- Saved analysis history per user
- Profile, password, notification preference, and account deletion endpoints
- Responsive React interface built with Vite, Tailwind CSS, Motion, and Lucide icons

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- Tailwind CSS
- Motion
- Lucide React

**Backend**

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- Groq SDK for AI analysis

## Project Structure

```text
Health-Hive/
├── backend/
│   ├── app.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── utils/
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection string
- Groq API key

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5001
```

Start the backend:

```bash
npm start
```

The backend runs on `http://localhost:5001` by default.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` if you need to override the default API URL:

```env
VITE_API_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on the Vite development URL, usually `http://localhost:5173`.

## API Overview

### User Routes

Base path: `/api/users`

- `GET /` - Get all users
- `POST /signup` - Create a user account
- `POST /login` - Log in and receive a JWT
- `GET /me` - Get the current authenticated user
- `PATCH /me` - Update profile information
- `PATCH /me/password` - Update password
- `PATCH /me/notifications` - Update notification preferences
- `DELETE /me` - Delete account and associated analysis history

### Analysis Routes

Base path: `/api/analyze`

- `POST /` - Submit symptoms for AI analysis
- `GET /` - Get the authenticated user's saved analyses
- `DELETE /:analysisId` - Delete a saved analysis

Protected routes require an `Authorization: Bearer <token>` header.

## Important Notes

- HealthHive is a research prototype and should not be used for medical diagnosis.
- Emergency symptoms should always be handled by calling emergency services or contacting a qualified medical professional.
- The AI analysis service requires a valid `GROQ_API_KEY`; without it, analysis requests return a service configuration error.
- CORS is currently configured for the deployed frontend and local Vite development URL in `backend/app.js`.

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
npm start
```

## License

This project currently uses the ISC license as defined in the backend package metadata.
