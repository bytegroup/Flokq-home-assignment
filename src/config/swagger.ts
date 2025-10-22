import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'flokq-home-assignment',
            version: '1.0.0',
            description: 'Build a mini full-stack application for managing and browsing auto parts.',
        },
        servers: [
            {
                url: 'http://localhost:5000/api/',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.routes.ts'],
};

const swaggerDocs = swaggerJsdoc(options);
export default swaggerDocs;