export const ErrorMessages = {
    // Auth errors
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    INVALID_OLD_PASSWORD: 'Old password is incorrect',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_TOKEN: 'Invalid or expired token',

    // Part errors
    PART_NOT_FOUND: 'Part not found',
    INVALID_STOCK: 'Stock cannot be negative',
    INVALID_PRICE: 'Price must be greater than zero',
    INSUFFICIENT_STOCK: 'Insufficient stock available',

    // General errors
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    RESOURCE_NOT_FOUND: 'Resource not found',
};

export const SuccessMessages = {
    // Auth
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    PASSWORD_CHANGED: 'Password changed successfully',

    // Part
    PART_CREATED: 'Part created successfully',
    PART_UPDATED: 'Part updated successfully',
    PART_DELETED: 'Part deleted successfully',
    STOCK_ADJUSTED: 'Stock adjusted successfully',
};