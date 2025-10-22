import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UnauthorizedError } from '../types';
import { Logger } from '../utils/logger';
import { ErrorMessages } from '../utils/errorMessages';

/**
 * Middleware to authenticate JWT token using Passport
 */
export const jwtAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    passport.authenticate(
        'jwt',
        { session: false },
        (err: any, user: Express.User | false, info: any) => {
            // Handle errors
            if (err) {
                Logger.error('JWT authentication error', err);
                return next(err);
            }

            // No user found (invalid/expired token)
            if (!user) {
                Logger.warn('Unauthorized access attempt', {
                    path: req.path,
                    method: req.method,
                    ip: req.ip,
                    reason: info?.message || 'No user found',
                });
                return next(new UnauthorizedError(ErrorMessages.INVALID_TOKEN));
            }

            // Attach user to request
            req.userId = user.id;
            req.user = user;

            Logger.debug('User authenticated via JWT', {
                userId: user.id,
                email: user.email,
            });

            next();
        }
    )(req, res, next);
};

/**
 * Middleware to authenticate using Local strategy (email/password)
 */
export const localAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    passport.authenticate(
        'local',
        { session: false },
        (err: any, user: Express.User | false, info: any) => {
            // Handle errors
            if (err) {
                Logger.error('Local authentication error', err);
                return next(err);
            }

            // Authentication failed
            if (!user) {
                Logger.warn('Failed login attempt', {
                    email: req.body.email,
                    ip: req.ip,
                });
                return next(
                    new UnauthorizedError(info?.message || ErrorMessages.INVALID_CREDENTIALS)
                );
            }

            // Attach user to request
            req.user = user;

            Logger.info('User logged in successfully', {
                userId: user.id,
                email: user.email,
            });

            next();
        }
    )(req, res, next);
};

/**
 * Optional: Role-based access control middleware
 */
export const requireRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new UnauthorizedError(ErrorMessages.UNAUTHORIZED));
        }

        next();
    };
};