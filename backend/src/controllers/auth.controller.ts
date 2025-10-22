import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { registerSchema, changePasswordSchema } from '../utils/validation';
import { ConflictError, UnauthorizedError } from '../types';
import { ErrorMessages, SuccessMessages } from '../utils/errorMessages';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const user = await authService.registerUser(validatedData);

        res.status(201).json({
            success: true,
            message: SuccessMessages.REGISTER_SUCCESS,
            user,
        });
    } catch (error: any) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return next(new ConflictError(ErrorMessages.EMAIL_ALREADY_EXISTS));
        }
        next(error);
    }
};

/**
 * Login user using Passport Local Strategy
 * POST /api/auth/login
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // User is already authenticated by Passport Local Strategy
        const user = req.user!;

        // Generate JWT token using service
        const token = authService.generateToken(user.id, user.email);

        res.json({
            success: true,
            message: SuccessMessages.LOGIN_SUCCESS,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await authService.getUserProfile(req.userId!);

        res.json({
            success: true,
            user,
        });
    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            return next(new UnauthorizedError(ErrorMessages.USER_NOT_FOUND));
        }
        next(error);
    }
};

/**
 * Change user password
 * PUT /api/auth/change-password
 */
export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validatedData = changePasswordSchema.parse(req.body);

        await authService.changePassword(
            req.userId!,
            validatedData.oldPassword,
            validatedData.newPassword
        );

        res.json({
            success: true,
            message: SuccessMessages.PASSWORD_CHANGED,
        });
    } catch (error: any) {
        if (error.message === 'INVALID_OLD_PASSWORD') {
            return next(new UnauthorizedError(ErrorMessages.INVALID_OLD_PASSWORD));
        }
        if (error.message === 'USER_NOT_FOUND') {
            return next(new UnauthorizedError(ErrorMessages.USER_NOT_FOUND));
        }
        next(error);
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh token
 * POST /api/auth/refresh
 */
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = req.user!;

        const token = authService.generateToken(user.id, user.email);

        res.json({
            success: true,
            token,
        });
    } catch (error) {
        next(error);
    }
};