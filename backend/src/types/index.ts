import { Request } from 'express';

// Extend Express Request with custom properties
export interface AuthRequest extends Request {
    userId?: number;
    user?: {
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        passwordHash: string;
    };
}

export interface JWTPayload {
    userId: number;
    email: string;
}

// DTOs (Data Transfer Objects)
export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface CreatePartDTO {
    name: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
}

export interface UpdatePartDTO {
    name?: string;
    brand?: string;
    price?: number;
    stock?: number;
    category?: string;
    imageUrl?: string;
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

export interface PaginationResult {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Service Response Types
export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Custom Error Types
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(404, message, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(401, message, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message, 'CONFLICT');
        this.name = 'ConflictError';
    }
}