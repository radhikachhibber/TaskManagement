import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Task Management API',
        version: '1.0.0',
        description: 'API documentation for Task Management app'
      }
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              example: 'securepassword123',
            },
          },
        },
      },
    },
    apis: ['./app.js']
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  export default swaggerSpec;
 