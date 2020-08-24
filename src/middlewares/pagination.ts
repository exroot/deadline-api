import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";

export class PaginationMiddleware extends BaseMiddleware {
    public handler(req: Request, res: Response, next: NextFunction) {
        const availableOrders = ["ASC", "DESC"];
        let order = req.query.orderBy as string;
        let sort = req.query.sortBy as string;
        let page = req.query.page;
        let limit = req.query.limit;
        if (!limit || Number(limit) > 10) {
            limit = "10";
        }
        if (!page) {
            page = "1";
        }
        if (!sort) {
            sort = "id";
        }
        if (!order || !availableOrders.includes(order.toUpperCase())) {
            order = "DESC";
        }
        req.query.sortBy = sort;
        req.query.orderBy = order.toUpperCase();
        req.query.limit = limit;
        req.query.page = page;
        next();
    }
}
