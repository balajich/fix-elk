const express = require('express');
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const app = express();
const port = 3000;

// Define custom log format
const logFormat = printf(({ timestamp, level, message, service, stacktrace }) => {
    return `${timestamp} ${level} [${service}] ${message} ${stacktrace ? `\nStacktrace: ${stacktrace}` : ''}`;
});

// Configure text logger
const textLogger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        winston.format((info) => {
            info.service = 'nodejs-app';
            return info;
        })(),
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/text.log' })
    ]
});

// Configure JSON logger
const jsonLogger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        winston.format((info) => {
            info.service = 'nodejs-app';
            return info;
        })(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/json.log' })
    ]
});

// Middleware to capture stack trace
app.use((err, req, res, next) => {
    const stacktrace = err.stack || 'No stacktrace available';
    textLogger.error('An error occurred', { stacktrace });
    jsonLogger.error('An error occurred', { stacktrace });
    res.status(500).send('Internal Server Error');
});

// Define a route
app.get('/hello', (req, res) => {
    const message = 'Hello World';
    textLogger.info('User accessed /hello endpoint');
    jsonLogger.info({ message: 'User accessed /hello endpoint' });
    res.send(message);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
