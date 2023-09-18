const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const exHbs = require('express-handlebars');


require("dotenv").config({path: `.env.${process.env.NODE_ENV}`});

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));
const errorHandler = require("./middleware/error_handling_middleware.js");
const {
    expressWinstonErrorLogger,
    expressWinstonLogger
} = require('./middleware/loggerMiddleware.js');

////////////////////////////////////////////////     WINSTON
// const expressWinston = require('express-winston');
// const winston = require('winston');
// const logger = require("./services/logger.js");
// logger.log("info", "LOG ma'lumotlar");
// logger.error("ERROR ma'lumotlar");
// logger.debug("DEBUG ma'lumotlar");
// logger.warn("WARN ma'lumotlar");
// logger.info("INFO ma'lumotlar");
// console.trace("TRACE ma'lumotlar");
// console.table(["SALIM", "KARIM", "NODIR"]);
// console.table([
    //     ["SALIM", "KARIM", "NODIR"],
    //     ["20", "24", "26"]
    // ]);

    // console.table([
        //     ["SALIM", "20"],
        //     ["KARIM", "24"],
        //     ["NODIR", "26"]
        // ]);
        ////////////////////////////////////////////////////////////

const app = express();

const PORT = config.get("port") || 3030
const mainRouter = require("./routes/index.routes.js");

process.on("uncaughtException", exception => {
    console.log("uncaughtException:", exception.message);
    // process.exit(1);
});

process.on("unhandledRejection", rejection => {
    console.log("unhandledRejection:", rejection);
    // process.exit(1);
});

// PARSERS
app.use(express.json());
app.use(cookieParser());

/////////////////////////////
const hbs = exHbs.create({
    defaultLayout: "main",
    extname: "hbs", //handlebars
});

app.engine("hbs", hbs.engine);

app.set("View engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));
//////////////////////////////

// app.use(expressWinstonLogger);

app.use(mainRouter);

app.use(expressWinstonErrorLogger);

// There should always be an error check!
app.use(errorHandler);

async function start() {
    try {
        await mongoose.connect(config.get("dbURI"));

        app.listen(PORT, () => {
            console.log(`Server ${PORT}-da ishga tushdi`);
        })
    } catch (error) {
        console.log('Serverda xatolik');
    }
}

start();
