import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Voting Platform API',
            version: '1.0.0',
            description: 'API for a voting platform',
            contact: {
                name: 'Developer',
            },
            servers: [`http://localhost:${process.env.PORT || 3003}`],
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
