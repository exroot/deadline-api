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
    @inject(TYPE.OperacionService)
    private readonly _operacionService: IOperacionService;
    private static operacionDict = {
        GET: "Read",
        POST: "Create",
        PATCH: "Update",
        DELETE: "Delete",
    };
    private static recursoDict = {
        bitacora: "Bitacora",
        carreras: "Carrera",
        categorias: "Categoria",
        materias: "Materia",
        operaciones: "Operacion",
        permisos: "Permiso",
        profesores: "Profesor",
        recursos: "Recurso",
        roles: "Rol",
        tareas: "Tarea",
        usuarios: "Usuario",
    };
    public async handler(req: Request, res: Response, next: NextFunction) {
        const arrayPath = this.httpContext.request.path.split("/");
        let data = {
            recursoPath: arrayPath[1],
            method: this.httpContext.request.method,
            elemento_id:
                arrayPath.length > 2
                    ? arrayPath[2]
                    : this.httpContext.request.method === "GET"
                    ? "All"
                    : null,
        };
        const operacion = await this.getOperacion(data.method);
        const recurso = await this.getRecurso(data.recursoPath);
        const usuario = this.httpContext.user.details;
        await this._bitacoraService.audit(
            data.elemento_id,
            usuario.usuario_id,
            operacion.id,
            recurso.id
        );
        next();
    }
    private async getOperacion(httpMethod: string): Promise<IOperacion> {
        const operacion = AuditMiddleware.operacionDict[httpMethod];
        return this._operacionService.getByOperacion(operacion);
    }
    private async getRecurso(recursoPath: string): Promise<IRecurso> {
        const recurso = AuditMiddleware.recursoDict[recursoPath];
        return this._recursoService.getByRecurso(recurso);
    }
}
