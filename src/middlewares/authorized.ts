import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { injectable } from "inversify";

@injectable()
export class Authorized extends BaseMiddleware {
    private static operacionDict = {
        GET: "Leer",
        POST: "Crear",
        PATCH: "Actualizar",
        DELETE: "Eliminar",
    };
    private static recursoDict = {
        bitacora: "bitacora",
        carreras: "carrera",
        categorias: "categoria",
        materias: "materia",
        operaciones: "operacion",
        permisos: "permiso",
        profesores: "profesor",
        recursos: "recurso",
        roles: "rol",
        tareas: "tarea",
        usuarios: "usuario",
    };
    public async handler(req: Request, res: Response, next: NextFunction) {
        const arrayPath = this.httpContext.request.path.split("/");
        const operacion =
            Authorized.operacionDict[this.httpContext.request.method];
        const recurso = Authorized.recursoDict[arrayPath[1]];
        const hasPermission = this.httpContext.user.details.permisos.includes(
            `${operacion} ${recurso}`
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
