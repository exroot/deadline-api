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
    IOperacion,
    IOperacionService,
    IValidationResponse,
} from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/operaciones")
export class OperacionController extends BaseHttpController {
    @inject(TYPE.OperacionService)
    private readonly _service: IOperacionService;
    @inject(TYPE.OperacionSchema)
    private readonly _schema: Schema<IOperacion>;
    @httpGet("/search", TYPE.Authenticated, TYPE.Authorized)
    public async search(
        @queryParam("operacion") operacion: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const results = await this._service.search(operacion);
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
        const operacionId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                operacionId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const content = await this._service.get(operacionId);
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
        @requestBody() newData: IOperacion,
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
            } = await this._service.operacionStatus(newData.operacion);
            if (conflict) {
                return this.json(conflictData);
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
        @requestBody() updatedData: IOperacion,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const operacionId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                operacionId
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
            } = await this._service.operacionStatus(
                updatedData.operacion,
                operacionId
            );
            if (conflict) {
                return this.json(conflictData);
            }
            await this._service.update(operacionId, updatedData);
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
        const operacionId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                operacionId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            await this._service.delete(operacionId);
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
