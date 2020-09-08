import { Repository } from "typeorm";
import { injectable, inject } from "inversify";
import { IUsuario, ICredentials, IPermiso } from "../constants/interfaces";
import { TYPE } from "../constants/types";
import jwt from "jsonwebtoken";

@injectable()
export class AuthService {
    protected _usuarioRepository: Repository<IUsuario>;
    private readonly _relations: string[];
    constructor(
        @inject(TYPE.UsuarioRepository) usuarioRepository: Repository<IUsuario>
    ) {
        this._usuarioRepository = usuarioRepository;
        this._relations = ["carrera", "rol", "rol.permisos"];
    }
    async registered(identifier: string): Promise<boolean> {
        const usuario = await this._usuarioRepository.findOne({
            where: [
                {
                    username: identifier,
                },
                {
                    email: identifier,
                },
            ],
        });
        return usuario !== undefined;
    }
    async validCredentials(credentials: ICredentials): Promise<boolean> {
        const { password, identifier } = credentials;
        let usuario = await this._usuarioRepository.findOne({
            where: [
                {
                    username: identifier,
                },
                {
                    email: identifier,
                },
            ],
            select: ["id", "username", "email", "password"],
        });
        return usuario.comparePassword(password);
    }
    async register(data: IUsuario): Promise<any> {
        /* to trigger the hashing password method, an entity instance is needed, thats why .create() method is called */
        const { password, ...usuario } = await this._usuarioRepository
            .create({
                username: data.username,
                email: data.email,
                password: data.password,
                imagen: data.imagen,
                carrera_id: data.carrera_id,
            })
            .save();
        return usuario;
    }

    async makeToken(identifier: string): Promise<object> {
        const usuario = await this._usuarioRepository.findOne({
            where: [
                {
                    username: identifier,
                },
                {
                    email: identifier,
                },
            ],
            relations: this._relations,
        });
        const permisos = usuario.rol.permisos as IPermiso[];
        const payload = {
            usuario_id: usuario.id,
            username: usuario.username,
            rol: usuario.rol.rol,
            permisos: permisos.map((p) => p.permiso),
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        return { accessToken, expiresIn: 3600 };
    }

    async getUser(token: string): Promise<any> {
        let payload: any;
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return;
            }
            payload = decodedToken;
        });
        return payload;
    }
}
