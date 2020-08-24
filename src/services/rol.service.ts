import { Repository } from "typeorm";
import { IRol, IConflictResponse } from "../constants/interfaces";
import { inject } from "inversify";
import { TYPE } from "../constants/types";
import { BaseService } from "./base.service";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class RolService extends BaseService {
    private readonly _sortableColumns: string[];
    private readonly _relations: string[];
    constructor(
        @inject(TYPE.RolRepository)
        rolRepository: Repository<IRol>
    ) {
        super(rolRepository, { useSoftDeletes: true });
        this._sortableColumns = ["id", "rol"];
        this._relations = ["permisos"];
    }
    get(id: number): Promise<IRol> {
        return this._repository.findOne(id, {
            relations: this._relations,
        });
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IRol[]> {
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
        const rol = await this._repository.save(newData);
        if (newData.permisos) {
            await this._repository
                .createQueryBuilder("Rol")
                .relation("Rol", "permisos")
                .of(rol)
                .add(newData.permisos);
        }
        return rol;
    }
    async update(id: number, updatedData: any): Promise<any> {
        const { permisos, ...data } = updatedData;
        await this._repository.update(id, data);
        if (permisos) {
            const viejosPermisos = await this._repository
                .createQueryBuilder("Rol")
                .relation("Rol", "permisos")
                .of(id)
                .loadMany();
            await this._repository
                .createQueryBuilder("Rol")
                .relation("Rol", "permisos")
                .of(id)
                .addAndRemove(permisos, viejosPermisos);
        }
        return;
    }

    async rolStatus(rol: string, id?: number): Promise<IConflictResponse> {
        const result = await this._repository
            .createQueryBuilder("Rol")
            .where("Rol.rol= :rol", { rol })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "El rol ya se encuentra registrado.",
            },
        };
    }

    async search(rol: string): Promise<IRol[]> {
        return this._repository
            .createQueryBuilder("Rol")
            .where("Rol.rol LIKE :rol", {
                rol: `%${rol}%`,
            })
            .orderBy("Rol.rol", "ASC")
            .limit(6)
            .getMany();
    }
}
