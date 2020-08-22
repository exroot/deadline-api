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
import {
    IPermiso,
    IPermisoService,
    IValidationResponse,
} from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/permisos")
export class PermisoController extends BaseHttpController {
    @inject(TYPE.PermisoService)
    private readonly _service: IPermisoService;
    @inject(TYPE.OperacionSchema)
    private readonly _schema: Schema<IPermiso>;
    @httpGet("/search", TYPE.Authenticated, TYPE.Authorized)
    public async search(
        @queryParam("permiso") permiso: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const results = await this._service.search(permiso);
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
        const permisoId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                permisoId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const content = await this._service.get(permisoId);
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
        @requestBody() newData: IPermiso,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const { error, errorData } = await this.validateInput(newData);
            if (error) {
                return this.json(errorData, 422);
            }
            const {
                conflict,
                conflictData,
            } = await this._service.permisoStatus(newData.permiso);
            if (conflict) {
                return this.json(conflictData, 409);
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
        @requestBody() updatedData: IPermiso,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const permisoId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                permisoId
            );
            const { error, errorData } = await this.validateInput(updatedData);
            if (error) {
                return this.json(errorData, 422);
            }
            const {
                conflict,
                conflictData,
            } = await this._service.permisoStatus(
                updatedData.permiso,
                permisoId
            );
            if (conflict) {
                return this.json(conflictData, 409);
            }
            await this._service.update(permisoId, updatedData);
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
        const permisoId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                permisoId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            await this._service.delete(permisoId);
            return this.ok();
        } catch (err) {
            next(err);
        }
    }
    private async validateInput(data: any): Promise<IValidationResponse> {
        let response: any = null;
        await this._schema
            .validate(data, { abortEarly: false })
            .catch((errors) => (response = errors));
        return {
            error: !!response,
            errorData: {
                name: response?.name,
                errors: response?.errors,
            },
        };
    }
}
