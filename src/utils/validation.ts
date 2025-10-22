import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Parts Schemas
export const createPartSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    brand: z.string().min(1, 'Brand is required'),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().nonnegative('Stock must be non-negative'),
    category: z.string().min(1, 'Category is required'),
    imageUrl: z.url('Invalid URL').optional().or(z.literal('')),
});

export const updatePartSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
    price: z.number().positive('Price must be positive').optional(),
    stock: z.number().int().nonnegative('Stock must be non-negative').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    imageUrl: z.url('Invalid URL').optional().or(z.literal('')),
});

export const adjustStockSchema = z.object({
    quantity: z.number().int('Quantity must be an integer'),
});

// Pagination Schema
export const paginationSchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
    category: z.string().optional(),
    sortBy: z.enum(['name', 'price', 'stock', 'createdAt', 'brand', 'category']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ID Param Schema
export const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePartInput = z.infer<typeof createPartSchema>;
export type UpdatePartInput = z.infer<typeof updatePartSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;