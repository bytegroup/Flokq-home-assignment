import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../../services/auth.service';
import userRepository from '../../../repositories/user.repository';

// Mock dependencies
jest.mock('../../../repositories/user.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
        // Set environment variable for tests
        process.env.JWT_SECRET = 'test-secret-key-for-testing';
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            const mockUser = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                createdAt: new Date(),
            };

            (userRepository.existsByEmail as jest.Mock).mockResolvedValue(false);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (userRepository.create as jest.Mock).mockResolvedValue(mockUser);

            const result = await authService.registerUser(userData);

            expect(result).toEqual(mockUser);
            expect(userRepository.existsByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(userRepository.create).toHaveBeenCalled();
        });

        it('should throw error if email already exists', async () => {
            const userData = {
                name: 'Test User',
                email: 'existing@example.com',
                password: 'password123',
            };

            (userRepository.existsByEmail as jest.Mock).mockResolvedValue(true);

            await expect(authService.registerUser(userData)).rejects.toThrow(
                'EMAIL_ALREADY_EXISTS'
            );

            expect(userRepository.existsByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(userRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user with valid credentials', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            const mockUser = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: 'hashedPassword',
                createdAt: new Date(),
            };

            (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await authService.authenticateUser(email, password);

            expect(result).toEqual(mockUser);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
        });

        it('should throw error if user not found', async () => {
            (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(
                authService.authenticateUser('notfound@example.com', 'password123')
            ).rejects.toThrow('INVALID_CREDENTIALS');
        });

        it('should throw error if password is invalid', async () => {
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                passwordHash: 'hashedPassword',
            };

            (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                authService.authenticateUser('test@example.com', 'wrongpassword')
            ).rejects.toThrow('INVALID_CREDENTIALS');
        });
    });

    describe('generateToken', () => {
        it('should generate JWT token', () => {
            const userId = 1;
            const email = 'test@example.com';
            const mockToken = 'mock.jwt.token';

            (jwt.sign as jest.Mock).mockReturnValue(mockToken);

            const result = authService.generateToken(userId, email);

            expect(result).toBe(mockToken);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId, email },
                process.env.JWT_SECRET,
                expect.objectContaining({ expiresIn: expect.any(Number) })
            );
        });
    });

    describe('getUserProfile', () => {
        it('should return user profile', async () => {
            const userId = 1;
            const mockUser = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                createdAt: new Date(),
            };

            (userRepository.findByIdWithoutPassword as jest.Mock).mockResolvedValue(mockUser);

            const result = await authService.getUserProfile(userId);

            expect(result).toEqual(mockUser);
            expect(userRepository.findByIdWithoutPassword).toHaveBeenCalledWith(userId);
        });

        it('should throw error if user not found', async () => {
            (userRepository.findByIdWithoutPassword as jest.Mock).mockResolvedValue(null);

            await expect(authService.getUserProfile(999)).rejects.toThrow('USER_NOT_FOUND');
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const userId = 1;
            const oldPassword = 'oldpass123';
            const newPassword = 'newpass456';

            const mockUser = {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: 'oldHashedPassword',
                createdAt: new Date(),
            };

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
            (userRepository.updatePassword as jest.Mock).mockResolvedValue(undefined);

            await authService.changePassword(userId, oldPassword, newPassword);

            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(bcrypt.compare).toHaveBeenCalledWith(oldPassword, mockUser.passwordHash);
            expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
            expect(userRepository.updatePassword).toHaveBeenCalledWith(userId, 'newHashedPassword');
        });

        it('should throw error if old password is invalid', async () => {
            const mockUser = {
                id: 1,
                passwordHash: 'hashedPassword',
            };

            (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                authService.changePassword(1, 'wrongold', 'newpass')
            ).rejects.toThrow('INVALID_OLD_PASSWORD');

            expect(userRepository.updatePassword).not.toHaveBeenCalled();
        });
    });
});