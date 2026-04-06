import express from 'express';
import { analyzeSymptoms, getUserAnalyses } from '../controllers/analyze-controller.js';
import checkAuth from '../middleware/check-auth.js';

const router = express.Router();

router.post('/', checkAuth, analyzeSymptoms);
router.get('/', checkAuth, getUserAnalyses);

export default router;