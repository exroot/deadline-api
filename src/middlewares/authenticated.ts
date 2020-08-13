import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class Authenticated extends BaseMiddleware {
    public handler(req: Request, res: Response, next: NextFunction) {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(400).json({
                message: "Token must be sent",
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid token",
                });
            }
            next();
        });
    }
}
