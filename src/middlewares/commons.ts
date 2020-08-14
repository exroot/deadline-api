import { urlencoded, json, Request, Response, NextFunction } from "express";
import compression from "compression";
// import expressWinston from "express-winston";
// import winston from "winston";
import cors from "cors";

const headers = (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // or website
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    next();
};

export default [
    cors(),
    compression(),
    urlencoded({ extended: true }),
    json(),
    // expressWinston.logger({
    //     transports: [new winston.transports.Console()],
    //     format: winston.format.combine(
    //         winston.format.colorize(),
    //         winston.format.json()
    //     ),
    //     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    //     msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    //     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    //     colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    //     ignoreRoute: function (req, res) {
    //         return false;
    //     }, // optional: allows to skip some log messages based on request and/or response
    // }),
    headers,
];
