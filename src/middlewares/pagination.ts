import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";

export class PaginationMiddleware extends BaseMiddleware {
    public handler(req: Request, res: Response, next: NextFunction) {
        if (!req.query.limit || Number(req.query.limit) > 10) {
            req.query.limit = "10";
        }
        if (!req.query.page) {
            req.query.page = "1";
        }
        if (!req.query.sortBy) {
            req.query.sortBy = "id";
        }
        if (
            !req.query.orderBy ||
            (req.query.orderBy !== "asc" && req.query.orderBy !== "desc")
        ) {
            req.query.orderBy = "desc";
        }
        next();
    }
}
