import { Response, Request, NextFunction } from "express";
import {
    controller,
    httpGet,
    httpPost,
    request,
    response,
    next,
    requestParam,
    requestBody,
    httpPatch,
    httpDelete,
    queryParam,
    BaseHttpController,
} from "inversify-express-utils";
import {
    ICarrera,
    ICarreraService,
    IValidationResponse,
} from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/carreras")
export class CarreraController extends BaseHttpController {
    @inject(TYPE.CarreraService)
    private readonly _service: ICarreraService;
    @inject(TYPE.CarreraSchema)
    private readonly _schema: Schema<ICarrera>;

    @httpGet("/search", TYPE.Authenticated, TYPE.Authorized)
    public async search(
        @queryParam("carrera") carrera: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const results = await this._service.search(carrera);
            return results;
        } catch (err) {
            next(err);
        }
    }
    @httpGet("/:id", TYPE.Authenticated, TYPE.Authorized, TYPE.AuditMiddleware)
    public async get(
        @requestParam("id") id: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const carreraId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                carreraId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const content = await this._service.get(carreraId);
            return content;
        } catch (err) {
            next(err);
        }
    }
    @httpGet(
        "/",
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
            return this._service.getMany(
                parseInt(page),
                parseInt(limit),
                sortBy,
                orderBy
            );
        } catch (err) {
            next(err);
        }
    }

    @httpPost(
        "/",
        TYPE.Authenticated,
        TYPE.Authorized,
        TYPE.AuditMiddleware,
        TYPE.Authenticated
    )
    public async post(
        @request() req: Request,
        @response() res: Response,
        @requestBody() newData: ICarrera,
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
            } = await this._service.carreraStatus(newData.carrera);
            if (conflict) {
                return this.json(conflictData, 409);
            }
            const content = await this._service.create(newData);
            return this.created("/", content);
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
        @requestBody() updatedData: ICarrera,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const carreraId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                carreraId
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
            } = await this._service.carreraStatus(
                updatedData.carrera,
                carreraId
            );
            if (conflict) {
                return this.json(conflictData, 409);
            }
            await this._service.update(carreraId, updatedData);
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
        @requestParam("id") id: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const carreraId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                carreraId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            await this._service.delete(carreraId);
            return this.ok();
        } catch (err) {
            next(err);
        }
    }
    private async validateInput(data: any): Promise<IValidationResponse> {
        let response: any = null;
        await this._schema
            .validate(data, {
                abortEarly: false,
                strict: true,
            })
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
