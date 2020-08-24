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
    IMateria,
    IMateriaService,
    IValidationResponse,
} from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/materias")
export class MateriaController extends BaseHttpController {
    @inject(TYPE.MateriaService)
    private readonly _service: IMateriaService;
    @inject(TYPE.MateriaSchema)
    private readonly _schema: Schema<IMateria>;
    @httpGet("/search", TYPE.Authenticated, TYPE.Authorized)
    public async search(
        @queryParam("materia") materia: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const results = await this._service.search(materia);
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
        const materiaId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                materiaId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const content = await this._service.get(materiaId);

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
        @requestBody() newData: IMateria,
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
            } = await this._service.materiaStatus(newData.materia);
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
        @requestBody() updatedData: IMateria,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const materiaId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                materiaId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const { error, errorData } = await this.validateInput(updatedData);
            if (error) {
                return this.json(errorData, 422);
            }
            const {
                conflict,
                conflictData,
            } = await this._service.materiaStatus(
                updatedData.materia,
                materiaId
            );
            if (conflict) {
                return this.json(conflictData, 409);
            }
            await this._service.update(materiaId, updatedData);
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
        const materiaId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                materiaId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            await this._service.delete(materiaId);
            return this.ok();
        } catch (err) {
            next(err);
        }
    }
    private async validateInput(data: any): Promise<IValidationResponse> {
        let response: any = null;
        await this._schema
            .validate(data, { abortEarly: false, strict: true })
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
