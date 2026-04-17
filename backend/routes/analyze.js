import express from 'express';
import { analyzeSymptoms, getUserAnalyses, deleteAnalysis } from '../controllers/analyze-controller.js';
import checkAuth from '../middleware/check-auth.js';

const router = express.Router();

router.post('/', checkAuth, analyzeSymptoms);
router.get('/', checkAuth, getUserAnalyses);
router.delete('/:analysisId', checkAuth, deleteAnalysis);

export default router;
