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
    queryParam,
    BaseHttpController,
} from "inversify-express-utils";
import {
    IBitacora,
    IBitacoraService,
    IValidationResponse,
} from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/bitacora")
export class BitacoraController extends BaseHttpController {
    @inject(TYPE.BitacoraService)
    private readonly _service: IBitacoraService;
    @inject(TYPE.BitacoraSchema)
    private readonly _schema: Schema<IBitacora>;
    @httpGet("/search", TYPE.Authenticated, TYPE.Authorized)
    public async search(
        @queryParam("username") username: string,
        @queryParam("email") email: string,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const searchOptions = {
            username,
            email,
        };
        try {
            const results = await this._service.search(searchOptions);
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
        const bitacoraId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                bitacoraId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const content = await this._service.get(bitacoraId);
            return content;
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

    @httpPost("/", TYPE.Authenticated, TYPE.Authorized, TYPE.AuditMiddleware)
    public async post(
        @request() req: Request,
        @response() res: Response,
        @requestBody() newData: IBitacora,
        @next() next: NextFunction
    ) {
        try {
            const { error, errorData } = await this.validateInput(newData);
            if (error) {
                return this.json(errorData, 422);
            }
            const content = await this._service.create(newData);
            return this.created("/", content);
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
