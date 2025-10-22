export const mockPrismaUser = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
};

export const mockPrismaPart = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
    aggregate: jest.fn(),
};

export const mockPrisma = {
    user: mockPrismaUser,
    part: mockPrismaPart,
    $disconnect: jest.fn(),
};

// Mock the prisma module
jest.mock('../../config/database', () => ({
    __esModule: true,
    default: mockPrisma,
}));