const swaggerAutogen = require('swagger-autogen');
const doc = {
    info: {
        title: 'API Documentation',
        description: 'API Documentation for the application',
    },
    host: 'localhost:3000',
    schemes:['http', 'https'],
};

const ouputFile = './swagger.json'
const endpointsFiles = ['./routes/index.js']

swaggerAutogen(ouputFile, endpointsFiles, doc);