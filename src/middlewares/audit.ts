import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import {
    IBitacoraService,
    IRecursoService,
    IOperacionService,
    IOperacion,
    IRecurso,
} from "../constants/interfaces";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

export class AuditMiddleware extends BaseMiddleware {
    @inject(TYPE.BitacoraService)
    private readonly _bitacoraService: IBitacoraService;
    @inject(TYPE.RecursoService)
    private readonly _recursoService: IRecursoService;
    @inject(TYPE.RouteParserHelper)
    private readonly _extractData: Function;
    @inject(TYPE.OperacionService)
    private readonly _operacionService: IOperacionService;
    public async handler(req: Request, res: Response, next: NextFunction) {
        const { recursoLabel, operacionLabel, elemento_id } = this._extractData(
            this.httpContext.request
        );
        const recurso = await this.getRecurso(recursoLabel);
        const operacion = await this.getOperacion(operacionLabel);
        const usuario = this.httpContext.user.details;
        await this._bitacoraService.audit(
            elemento_id,
            usuario.usuario_id,
            operacion.id,
            recurso.id
        );
        next();
    }
    private async getOperacion(operacionLabel: string): Promise<IOperacion> {
        return this._operacionService.getByOperacion(operacionLabel);
    }
    private async getRecurso(recursoLabel: string): Promise<IRecurso> {
        return this._recursoService.getByRecurso(recursoLabel);
    }
}
