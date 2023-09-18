// const winston = require('winston');
require('winston-mongodb');

const config = require('config');
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint, json, colorize } = format


const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

let logger;

const devLog = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.Console({ level: "debug" }),
        new transports.File({filename: "log/error.log", level: "error"}), // handleExceptions: true
        new transports.File({filename: "log/combine.log", level: "info"}), // handleExceptions: true
    ],

    // exitOnError: false
});

const prodLog = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.File({filename: "log/error.log", level: "error"}), // handleExceptions: true
        new transports.MongoDB({
            db:config.get("dbURI"),
            options: {useUnifiedTopology: true},
        })
    ],

    // exitOnError: false
});


if(process.env.NODE_ENV=="production"){
    logger = prodLog
} else {
    logger = devLog
}

logger.exceptions.handle(
    new transports.File({filename: "log/exceptions.log"})
);

logger.rejections.handle(
    new transports.File({filename: "log/rejections.log"})
);

logger.exitOnError = false;
module.exports = logger;