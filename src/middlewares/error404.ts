import { Request, Response, NextFunction, Router } from "express";

export const error404 = (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        code: "Not found",
        message: "Ruta no encontrada.",
    });
};
