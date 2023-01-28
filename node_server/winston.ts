const winston = require("winston");
require('winston-daily-rotate-file');
const Mail = require("winston-mail").Mail;

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
        new winston.transports.DailyRotateFile({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            level: "debug",
            filename: "log/%DATE%/debug.log",
            auditFile: "log/auditFiles/debug.json",
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            level: "info",
            filename: "log/%DATE%/info.log",
            auditFile: "log/auditFiles/info.json",
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            level: "error",
            filename: "log/%DATE%/error.log",
            auditFile: "log/auditFiles/error.json",
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
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
            host: process.env.APP_SENDINBLUE_HOST,
            port: process.env.APP_SENDINBLUE_PORT,
            username: process.env.APP_SENDINBLUE_USER,
            password: process.env.APP_SENDINBLUE_PASSWORD,
        })
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            filename: "log/%DATE%/exception.log",
            auditFile: "log/auditFiles/exception.json",
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.Mail({
            to: "frazic.dev@gmail.com",
            from: "frazic.dev@gmail.com",
            subject: "Inclure.Net Exception",
            host: process.env.APP_SENDINBLUE_HOST,
            port: process.env.APP_SENDINBLUE_PORT,
            username: process.env.APP_SENDINBLUE_USER,
            password: process.env.APP_SENDINBLUE_PASSWORD,
            ssl: true
        })
    ],
    rejectionHandlers: [
        new winston.transports.DailyRotateFile({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            filename: "log/%DATE%/rejection.log",
            auditFile: "log/auditFiles/rejection.json",
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ],
    exitOnError: false
})