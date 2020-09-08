import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

export class Authorized extends BaseMiddleware {
    @inject(TYPE.RouteParserHelper)
    private readonly _extractData: Function;
    public async handler(req: Request, res: Response, next: NextFunction) {
        const { operacionLabel, recursoLabel } = this._extractData(
            this.httpContext.request
        );
        const hasPermission = this.httpContext.user.details.permisos.includes(
            `${operacionLabel} ${recursoLabel}`
        );
        if (
            hasPermission ||
            (await this.httpContext.user.isInRole("Administrador"))
        ) {
            return next();
        } else {
            return res.status(403).json({
                code: "Forbidden",
                message: "No posees los permisos necesarios.",
            });
        }
    }
}
