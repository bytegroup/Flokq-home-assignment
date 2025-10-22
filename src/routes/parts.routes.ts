import { Router } from 'express';
import {
    getAllParts,
    getPartById,
    createPart,
    updatePart,
    deletePart,
    getAnalytics,
} from '../controllers/parts.controller';
import { jwtAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllParts);
router.get('/:id', getPartById);

// Protected routes
router.post('/', jwtAuth, createPart);
router.put('/:id', jwtAuth, updatePart);
router.delete('/:id', jwtAuth, deletePart);

// Analytics
router.get('/analytics/overview', jwtAuth, getAnalytics);

export default router;