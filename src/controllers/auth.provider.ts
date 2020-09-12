import { interfaces } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { TYPE } from "../constants/types";
import { Request, Response, NextFunction } from "express";
import { Principal } from "../helpers/authHelper";
import { IAuthService } from "../constants/interfaces";

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
    @inject(TYPE.AuthService) private readonly _authService: IAuthService;

    public async getUser(req: Request, res: Response, next: NextFunction) {
        const token: string = req.headers["Authorization"] as string;
        const user = await this._authService.getUser(token);
        const principal = new Principal(user);
        return principal;
    }
}
