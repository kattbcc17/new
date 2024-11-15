const swaggerAutogen = require('swagger-autogen');


const doc = {
    info: {
        title: 'Finance Tracker API',
        description: 'API documentation for Finance Tracker',
    },
    host: 'localhost:8080',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const routes = ['./routes/income.js', './routes/expense.js', './routes/auth.js'];

swaggerAutogen(outputFile, routes, doc).then(async () => {
    await import('./index.js');  // Starts the server after generating swagger.json
});
