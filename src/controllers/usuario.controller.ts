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
    IUsuario,
    IUsuarioService,
    IValidationResponse,
} from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/usuarios")
export class UsuarioController extends BaseHttpController {
    @inject(TYPE.UsuarioService)
    private readonly _service: IUsuarioService;
    @inject(TYPE.UsuarioSchema)
    private readonly _schema: Schema<IUsuario>;
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
        @response() res: Response,
        @requestParam("id") id: string,
        @next() next: NextFunction
    ) {
        const usuarioId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                usuarioId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const content = await this._service.get(usuarioId);
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
        @requestBody() newData: IUsuario,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        try {
            const { error, errorData } = await this.validateInput(newData);
            if (error) {
                return this.json(errorData, 422);
            }
            const status = await this._service.usuarioStatus(
                newData.username,
                newData.email
            );
            if (status.username.registrado) {
                return this.json(
                    {
                        code: "Conflict",
                        message: "El username ya se encuentra en uso.",
                    },
                    409
                );
            }
            if (status.email.registrado) {
                return this.json(
                    {
                        code: "Conflict",
                        message: "El email ya se encuentra en uso.",
                    },
                    409
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
        @requestBody() updatedData: IUsuario,
        @response() res: Response,
        @next() next: NextFunction
    ) {
        const usuarioId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                usuarioId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            const { error, errorData } = await this.validateInput(updatedData);
            if (error) {
                return this.json(errorData, 422);
            }
            const { username, email } = await this._service.usuarioStatus(
                updatedData.username,
                updatedData.email
            );
            if (username.conflict) {
                return this.json(username.conflictData, 409);
            }
            if (email.conflict) {
                return this.json(email.conflictData, 409);
            }
            await this._service.update(usuarioId, updatedData);
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
        const usuarioId = parseInt(id);
        try {
            const { notFound, notFoundData } = await this._service.existe(
                usuarioId
            );
            if (notFound) {
                return this.json(notFoundData, 404);
            }
            await this._service.delete(usuarioId);
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
