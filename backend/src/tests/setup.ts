// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '3600';
process.env.DATABASE_URL = 'mysql://root:password@localhost:3306/auto_parts';

// Global test timeout
jest.setTimeout(10000);