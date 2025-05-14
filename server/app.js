import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // Import routes for authentication (signup & login)
import userRoutes from './routes/userRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

export const app = express(); // Create the Express app

// Enable Cross-Origin Resource Sharing (allows frontend to connect to backend)
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Parse URL-encoded data (e.g., from forms)
app.use(express.urlencoded({ extended: true }));

// Use the authentication routes under the '/api' path
// Example: POST request to http://localhost:8000/api/signup will trigger signup logic
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', historyRoutes);
