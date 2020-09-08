import { urlencoded, json } from "express";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

export default [
    cors({ origin: "http://localhost:3000", credentials: true }),
    compression(),
    urlencoded({ extended: true }),
    json(),
    cookieParser(),
    morgan("dev"),
];
