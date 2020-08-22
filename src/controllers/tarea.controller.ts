import { Response, NextFunction } from "express";
import {
    controller,
    httpGet,
    httpPost,
    response,
    requestParam,
    requestBody,
    next,
    httpPatch,
    httpDelete,
    queryParam,
    BaseHttpController,
} from "inversify-express-utils";
import { ITarea, ITareaService } from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/tareas")
export class TareaController extends BaseHttpController {
    @inject(TYPE.TareaService)
    private readonly _service: ITareaService;
    @inject(TYPE.TareaSchema)
    private readonly _schema: Schema<ITarea>;
    @httpGet("/search", TYPE.Authenticated, TYPE.Authorized)
    public async search(
        @queryParam("recurso") recurso: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const results = await this._service.search(recurso);
            return results;
        } catch (err) {
            next(err);
        }
    }
    @httpGet("/:id", TYPE.Authenticated, TYPE.Authorized, TYPE.AuditMiddleware)
    public async get(
        @response() res: Response,
        @requestParam("id") id: string,
        @next() next: NextFunction
    ) {
        const tareaId = parseInt(id);
        try {
            const content = await this._service.get(tareaId);
            if (!content) {
                return this.json(
                    {
                        code: "Not found",
                        message: "No se ha encontrado el recurso.",
                    },
                    404
                );
            }
            return this.json(content, 200);
        } catch (err) {
            next(err);
        }
    }
    @httpGet(
        "/",
        TYPE.Authenticated,
        TYPE.Authorized,
        TYPE.AuditMiddleware,
        TYPE.PaginationMiddleware
    )
    public async getMany(
        @queryParam("page") page: string,
        @queryParam("limit") limit: string,
        @queryParam("sortBy") sortBy: string,
        @queryParam("orderBy") orderBy: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const content = await this._service.getMany(
                parseInt(page),
                parseInt(limit),
                sortBy,
                orderBy
            );
            return this.json(content, 200);
        } catch (err) {
            next(err);
        }
    }

    @httpPost("/", TYPE.Authenticated, TYPE.Authorized, TYPE.AuditMiddleware)
    public async post(
        @requestBody() newData: ITarea,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            let errors: any = null;
            await this._schema
                .validate(newData, { abortEarly: false })
                .catch((err) => (errors = err));
            if (errors) {
                return this.json(
                    { code: "Unprocessable Entity", message: errors },
                    422
                );
            }
            const content = await this._service.create(newData);
            return this.json(content, 201);
        } catch (err) {
            next(err);
        }
    }

    @httpPatch(
        "/:id",
        TYPE.Authenticated,
        TYPE.Authorized,
        TYPE.AuditMiddleware
    )
    public async patch(
        @requestParam("id") id: string,
        @requestBody() updatedData: ITarea,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const tareaId = parseInt(id);
        try {
            const existe = await this._service.existe(tareaId);
            if (!existe) {
                return this.json(
                    {
                        code: "Not found",
                        message: "No se ha encontrado el recurso.",
                    },
                    404
                );
            }
            let errors: any = null;
            await this._schema
                .validate(updatedData, { abortEarly: false })
                .catch((err) => (errors = err));
            if (errors) {
                return this.json(
                    { code: "Unprocessable Entity", message: errors },
                    422
                );
            }
            await this._service.update(tareaId, updatedData);
            return this.ok();
        } catch (err) {
            next(err);
        }
    }

    @httpDelete(
        "/:id",
        TYPE.Authenticated,
        TYPE.Authorized,
        TYPE.AuditMiddleware
    )
    public async delete(
        @response() res: Response,
        @requestParam("id") id: string,
        @next() next: NextFunction
    ) {
        const tareaId = parseInt(id);
        try {
            const existe = await this._service.existe(tareaId);
            if (!existe) {
                return this.json(
                    {
                        code: "Not found",
                        message: "No se ha encontrado el recurso.",
                    },
                    404
                );
            }
            await this._service.delete(tareaId);
            return this.ok();
        } catch (err) {
            next(err);
        }
    }
}
