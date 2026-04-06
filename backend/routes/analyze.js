import express from 'express';
import { analyzeSymptoms } from '../controllers/analyze-controller.js';
import checkAuth from '../middleware/check-auth.js';

const router = express.Router();

router.post('/', checkAuth, analyzeSymptoms);

export default router;