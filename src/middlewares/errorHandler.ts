import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.status || 500;
    const env: string = process.env.APP_ENV.toUpperCase();
    if (env === "PRODUCTION") {
        return res
            .status(statusCode)
            .send({ message: "Unexpected server error." });
    }
    return res.status(statusCode).send({
        message: err.message,
    });
};
