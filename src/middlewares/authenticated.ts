import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class Authenticated extends BaseMiddleware {
    public handler(req: Request, res: Response, next: NextFunction) {
	let token = null;
		console.log("headers");
		console.log(req.headers["Authorization"]);
	   token = req.headers["Authorization"] || req.cookies.Authorization;
	   console.log("cookies");
	   console.log(req.cookies.Authorization);
	   console.log("token in authenticated middleware: ", token);
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

    // private JwtHeaderAuthentication(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     const token = req.headers["authorization"];
    //     if (!token) {
    //         return res.status(400).json({
    //             code: "Bad request",
    //             message: "No se ha encontrado el token de autenticación.",
    //         });
    //     }
    //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //         if (err) {
    //             return res.status(401).json({
    //                 code: "Unauthorized",
    //                 message: "Token inválido o expirado.",
    //             });
    //         }
    //         next();
    //     });
    // }

    // private JwtCookieAuthentication(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     const token = req.cookies.Authorization;
    //     if (!token) {
    //         return res.status(400).json({
    //             code: "Bad request",
    //             message: "No se ha encontrado el token de autenticación.",
    //         });
    //     }
    //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //         if (err) {
    //             return res.status(401).json({
    //                 code: "Unauthorized",
    //                 message: "Token inválido o expirado.",
    //             });
    //         }
    //         next();
    //     });
    // }
}
