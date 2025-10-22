import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../types';
import { Logger } from '../utils/logger';
import { ErrorMessages } from '../utils/errorMessages';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    Logger.error('Error occurred', {
        error: error.message,
        path: req.path,
        method: req.method,
    });

    // Custom App Errors
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.message,
            code: error.code,
        });
        return;
    }

    // Zod validation errors
    if (error instanceof ZodError) {
        res.status(400).json({
            error: ErrorMessages.VALIDATION_ERROR,
            details: error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        });
        return;
    }

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
            const field = (error.meta?.target as string[])?.join(', ') || 'field';
            res.status(409).json({
                error: `${field} already exists`,
                code: 'DUPLICATE_ENTRY',
            });
            return;
        }

        // Record not found
        if (error.code === 'P2025') {
            res.status(404).json({
                error: ErrorMessages.RESOURCE_NOT_FOUND,
                code: 'NOT_FOUND',
            });
            return;
        }

        // Foreign key constraint failed
        if (error.code === 'P2003') {
            res.status(400).json({
                error: 'Invalid reference to related resource',
                code: 'FOREIGN_KEY_CONSTRAINT',
            });
            return;
        }
    }

    // Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({
            error: ErrorMessages.VALIDATION_ERROR,
            code: 'VALIDATION_ERROR',
        });
        return;
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            error: ErrorMessages.INVALID_TOKEN,
            code: 'INVALID_TOKEN',
        });
        return;
    }

    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            error: 'Token has expired',
            code: 'TOKEN_EXPIRED',
        });
        return;
    }

    // Default error
    res.status(500).json({
        error: ErrorMessages.INTERNAL_ERROR,
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};

// Not Found Middleware
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    });
}