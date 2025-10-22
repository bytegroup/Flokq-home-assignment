import { mockPrisma, mockPrismaUser } from '../../mocks/prisma.mock';
import { UserRepository } from '../../../repositories/user.repository';

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        userRepository = new UserRepository();
        jest.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            const mockUser = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: 'hashed',
                createdAt: new Date(),
            };

            mockPrismaUser.findUnique.mockResolvedValue(mockUser);

            const result = await userRepository.findByEmail('test@example.com');

            expect(result).toEqual(mockUser);
            expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });

        it('should return null if user not found', async () => {
            mockPrismaUser.findUnique.mockResolvedValue(null);

            const result = await userRepository.findByEmail('notfound@example.com');

            expect(result).toBeNull();
        });
    });

    describe('existsByEmail', () => {
        it('should return true if user exists', async () => {
            mockPrismaUser.count.mockResolvedValue(1);

            const result = await userRepository.existsByEmail('test@example.com');

            expect(result).toBe(true);
            expect(mockPrismaUser.count).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });

        it('should return false if user does not exist', async () => {
            mockPrismaUser.count.mockResolvedValue(0);

            const result = await userRepository.existsByEmail('notfound@example.com');

            expect(result).toBe(false);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const userData = {
                name: 'New User',
                email: 'new@example.com',
                passwordHash: 'hashed',
            };

            const mockCreatedUser = {
                id: 1,
                name: 'New User',
                email: 'new@example.com',
                createdAt: new Date(),
            };

            mockPrismaUser.create.mockResolvedValue(mockCreatedUser);

            const result = await userRepository.create(userData);

            expect(result).toEqual(mockCreatedUser);
            expect(mockPrismaUser.create).toHaveBeenCalledWith({
                data: userData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            });
        });
    });
});