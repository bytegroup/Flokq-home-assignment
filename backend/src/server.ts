import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import passportConfig from './config/passport';
import authRoutes from './routes/auth.routes';
import partsRoutes from './routes/parts.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimit } from './middleware/rateLimiter';
import { Logger } from './utils/logger';
import swaggerDocs from "./config/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,        // e.g. http://frontend:3000
    'http://localhost:3000',         // for local dev outside docker
    process.env.NEXT_PUBLIC_URL,     // e.g. https://myapp.com in prod
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.NODE_ENV !== 'test') {
    app.use(requestLogger);
}

// Rate limiting (applied to all routes)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
}));

// Initialize Passport
app.use(passportConfig.initialize());
Logger.info('Passport.js initialized with Local and JWT strategies');

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    Logger.info(`🚀 Server running on http://localhost:${PORT}`);
    Logger.info(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;