import request from 'supertest';
import app from '../../server';
import prisma from '../../config/database';

describe('Auth API Integration Tests', () => {
    beforeAll(async () => {
        // Setup test database if needed
    });

    afterAll(async () => {
        // Cleanup
        await prisma.$disconnect();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Integration Test User',
                    email: `test${Date.now()}@example.com`,
                    password: 'password123',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('email');
        });

        it('should return 400 for invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'password123',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
        });

        it('should return 409 for duplicate email', async () => {
            const email = `duplicate${Date.now()}@example.com`;

            // First registration
            await request(app).post('/api/auth/register').send({
                name: 'First User',
                email,
                password: 'password123',
            });

            // Second registration with same email
            const response = await request(app).post('/api/auth/register').send({
                name: 'Second User',
                email,
                password: 'password123',
            });

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const email = `login${Date.now()}@example.com`;

            // Register user first
            await request(app).post('/api/auth/register').send({
                name: 'Login Test User',
                email,
                password: 'password123',
            });

            // Login
            const response = await request(app).post('/api/auth/login').send({
                email,
                password: 'password123',
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            expect(response.body.user).toHaveProperty('id');
        });

        it('should return 401 for invalid credentials', async () => {
            const response = await request(app).post('/api/auth/login').send({
                email: 'notexist@example.com',
                password: 'wrongpassword',
            });

            expect(response.status).toBe(401);
        });
    });
});