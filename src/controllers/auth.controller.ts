import {
    controller,
    BaseHttpController,
    request,
    response,
    next,
    httpPost,
    requestBody,
} from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { ICredentials, IAuthService, IUsuario } from "../constants/interfaces";
import { Schema } from "yup";
import { TYPE } from "../constants/types";
import { inject } from "inversify";

@controller("/auth")
export class AuthController extends BaseHttpController {
    @inject(TYPE.AuthService)
    private readonly _authService: IAuthService;
    @inject(TYPE.UsuarioSchema)
    private readonly _usuarioSchema: Schema<any>;

    @httpPost("/login")
    public async login(
        @request() req: Request,
        @response() res: Response,
        @requestBody() credentials: ICredentials,
        @next() next: NextFunction
    ) {
        try {
            if (!credentials.email && !credentials.username) {
                return this.json(
                    {
                        code: "Bad request",
                        message: "Debe ingresar un nombre de usuario o email.",
                    },
                    400
                );
            }
            const registered = await this._authService.registered(
                credentials.email || credentials.username
            );
            if (!registered) {
                return this.json(
                    {
                        code: "Not found",
                        message:
                            "Nombre de usuario o email no se encuentra registrado.",
                    },
                    404
                );
            }
            const validCredentials = await this._authService.validCredentials(
                credentials
            );
            if (!validCredentials) {
                return this.json(
                    {
                        code: "Unauthorized",
                        message: "Combinacion de credenciales inválidas.",
                    },
                    401
                );
            }
            const token = await this._authService.makeToken(
                credentials.email || credentials.username
            );
            return this.json(token, 200);
        } catch (err) {
            next(err);
        }
    }

    @httpPost("/register")
    public async register(
        @request() req: Request,
        @response() res: Response,
        @requestBody() data: IUsuario,
        @next() next: NextFunction
    ) {
        try {
            this._usuarioSchema
                .validate(data, { abortEarly: false })
                .catch((err) => this.json(err.errors, 401));
            const usernameTaked = await this._authService.registered(
                data.username
            );
            if (usernameTaked) {
                return this.json(
                    {
                        code: "Conflict",
                        message: "El nombre de usuario ya se encuentra en uso.",
                    },
                    409
                );
            }
            const email = await this._authService.registered(data.email);
            if (email) {
                return this.json(
                    {
                        code: "Conflict",
                        message: "El email ya se encuentra registrado.",
                    },
                    409
                );
            }
            const results = await this._authService.register(data);
            return this.json(results, 200);
        } catch (err) {
            next(err);
        }
    }
}
