import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../types';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                next(new ValidationError(firstError.message));
            } else {
                next(error);
            }
        }
    };
};

// Validate only body
export const validateBody = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                next(new ValidationError(firstError.message));
            } else {
                next(error);
            }
        }
    };
};

// Validate only query
export const validateQuery = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = await schema.parseAsync(req.query) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                next(new ValidationError(firstError.message));
            } else {
                next(error);
            }
        }
    };
};

// Validate only params
export const validateParams = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync(req.params);
            req.params = validated as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                next(new ValidationError(firstError.message));
            } else {
                next(error);
            }
        }
    };
};