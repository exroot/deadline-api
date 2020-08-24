import { BaseService } from "./base.service";
import { Repository } from "typeorm";
import { inject } from "inversify";
import { IUsuario, IConflictUsuarioResponse } from "../constants/interfaces";
import { TYPE } from "../constants/types";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class UsuarioService extends BaseService {
    private readonly _sortableColumns: string[];
    private readonly _relations: string[];
    constructor(
        @inject(TYPE.UsuarioRepository) usuarioRepo: Repository<IUsuario>
    ) {
        super(usuarioRepo, { useSoftDeletes: true });
        this._sortableColumns = ["rol", "carrera"];
        this._relations = ["carrera", "rol", "rol.permisos"];
    }
    get(id: number): Promise<any> {
        return this._repository.findOne(id, {
            relations: this._relations,
        });
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<any[]> {
        if (!this._sortableColumns.includes(sortBy)) {
            sortBy = "id";
        }
        return this._repository.find({
            relations: this._relations,
            order: {
                [sortBy]: orderBy as OrderBy,
            },
            skip: page * limit - limit,
        });
    }
    async create(newData: any): Promise<any> {
        /* Setting rol manually just in case (rol 1 by default) */
        newData.rol_id = 1;
        const results = await this._repository.save(newData);
        const { password, ...usuario } = results;
        return usuario;
    }
    async usuarioStatus(
        username: string,
        email: string,
        id?: number
    ): Promise<IConflictUsuarioResponse> {
        const usernameResult = await this._repository
            .createQueryBuilder("usuario")
            .where("usuario.username= :username", { username })
            .getOne();
        const emailResult = await this._repository
            .createQueryBuilder("usuario")
            .where("usuario.email= :email", { email })
            .getOne();
        return {
            username: {
                conflict: !!usernameResult && usernameResult.id !== id,
                conflictData: {
                    name: "Conflict",
                    message: "El username ya se encuentra en uso.",
                },
            },
            email: {
                conflict: !!emailResult && emailResult.id !== id,
                conflictData: {
                    name: "Conflict",
                    message: "El email ya se encuentra asociado a un usuario.",
                },
            },
        };
    }
    async search(options: any): Promise<IUsuario[]> {
        const { username, email } = options;
        return this._repository
            .createQueryBuilder("Usuario")
            .where("Usuario.username LIKE :username", {
                username: `%${username}%`,
            })
            .orWhere("Usuario.email LIKE :email", { email: `%${email}%` })
            .limit(6)
            .getMany();
    }
}
