const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FingerMobile Protocol API',
      version: '1.0.0',
      description: 'API documentation for the FingerMobile Protocol backend services, microservices, and models. This Swagger UI acts as a contract between the Frontend and Backend.',
      contact: {
        name: 'FingerMobile Dev Team'
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Main API route'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  // Look for swagger definitions in the following files
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'FingerMobile API Docs'
  }));

  // Expose swagger.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
