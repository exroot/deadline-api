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
                code: "Bad request",
                message: "No se ha encontrado el token de autenticación.",
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    code: "Unauthorized",
                    message: "Token inválido o expirado.",
                });
            }
            next();
        });
    }
}
