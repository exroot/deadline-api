import { urlencoded, json, Request, Response, NextFunction } from "express";
import compression from "compression";
import morgan from "morgan";
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
    morgan("dev"),
    headers,
];
