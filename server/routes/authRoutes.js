import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js'; // Import the controller functions

// Create a router object to define API routes
const router = express.Router();

// Route for user signup: sends POST request to /api/signup
router.post('/signup', signupUser);

// Route for user login: sends POST request to /api/login
router.post('/login', loginUser);

// Export the router so it can be used in the main app
export default router;
