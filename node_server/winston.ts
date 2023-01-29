const winston = require("winston");
require('winston-daily-rotate-file');
const Mail = require("winston-mail").Mail;
const { LoggingWinston } = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston();

module.exports = winston.createLogger({
    transports: [
        loggingWinston,
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
        new winston.transports.Mail({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            level: "error",
            to: "frazic.dev@gmail.com",
            from: "frazic.dev@gmail.com",
            subject: "Inclure.Net Error",
            host: process.env.SENDINBLUE_HOST,
            port: process.env.SENDINBLUE_PORT,
            username: process.env.SENDINBLUE_USER,
            password: process.env.SENDINBLUE_PASSWORD,
        })
    ],
    exceptionHandlers: [
        loggingWinston,
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
        new winston.transports.Mail({
            to: "frazic.dev@gmail.com",
            from: "frazic.dev@gmail.com",
            subject: "Inclure.Net Exception",
            host: process.env.SENDINBLUE_HOST,
            port: process.env.SENDINBLUE_PORT,
            username: process.env.SENDINBLUE_USER,
            password: process.env.SENDINBLUE_PASSWORD,
            ssl: true
        })
    ],
    rejectionHandlers: [
        loggingWinston,
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        })
    ],
    exitOnError: false
})