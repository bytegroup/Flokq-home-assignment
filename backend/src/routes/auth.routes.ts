import { Router } from 'express';
import {
    register,
    login,
    getProfile,
    changePassword,
    logout,
    refreshToken,
} from '../controllers/auth.controller';
import { jwtAuth, localAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { registerSchema, loginSchema, changePasswordSchema } from '../utils/validation';

const router = Router();

/**
 * Public routes
 */
// Register new user
router.post('/register', validateBody(registerSchema), register);

// Login user (uses Passport Local Strategy)
router.post('/login', validateBody(loginSchema), localAuth, login);

/**
 * Protected routes (require JWT authentication via Passport)
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: user profile
 *     responses:
 *       200:
 *         description: Get current user profile
 */
router.get('/profile', jwtAuth, getProfile);

// Change password
router.put('/change-password', jwtAuth, validateBody(changePasswordSchema), changePassword);

// Logout (client-side, but can track server-side)
router.post('/logout', jwtAuth, logout);

// Refresh token
router.post('/refresh', jwtAuth, refreshToken);

export default router;