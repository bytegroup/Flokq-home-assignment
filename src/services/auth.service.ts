import bcrypt from 'bcryptjs';
import jwt, {SignOptions} from 'jsonwebtoken';
import userRepository from '../repositories/user.repository';
import {JWTPayload} from '../types';

export class AuthService {
    async registerUser(data: {
        name: string;
        email: string;
        password: string;
    }) {
        // Check if user already exists
        const existingUser = await userRepository.existsByEmail(data.email);
        if (existingUser) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        return await userRepository.create({
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
        });
    }

    async authenticateUser(email: string, password: string) {
        // Find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('INVALID_CREDENTIALS');
        }

        return user;
    }

    generateToken(userId: number, email: string): string {
        const payload: JWTPayload = {
            userId,
            email,
        };

        const secret = process.env.JWT_SECRET || 'default-secret-key';
        const options: SignOptions = {
            expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string || '3600', 10),
        };

        return jwt.sign(payload, secret, options);
    }

    async getUserProfile(userId: number) {
        const user = await userRepository.findByIdWithoutPassword(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return user;
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        // Get user with password
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('INVALID_OLD_PASSWORD');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await userRepository.updatePassword(userId, hashedPassword);
    }
}

export default new AuthService();