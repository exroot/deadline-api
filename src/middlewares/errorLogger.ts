import expressWinston from "express-winston";
import winston from "winston";
import "winston-daily-rotate-file";

winston.addColors({
    info: "green",
    warn: "yellow",
    error: "red",
});

const fileTransport = new winston.transports.DailyRotateFile({
    filename: "./logs/[%DATE%] borderline-api.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
});
const consoleTransport = new winston.transports.Console();

export const errorLogger = expressWinston.errorLogger({
    transports: [consoleTransport, fileTransport],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
});
