import { Repository } from "typeorm";
import { IPermiso } from "../constants/interfaces";
import { inject } from "inversify";
import { TYPE } from "../constants/types";
import { BaseService } from "./base.service";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class PermisoService extends BaseService {
    private readonly _sortableColumns: string[];
    constructor(
        @inject(TYPE.PermisoRepository)
        permisoRepository: Repository<IPermiso>
    ) {
        super(permisoRepository, { useSoftDeletes: true });
        this._sortableColumns = ["id", "permiso"];
    }
    get(id: number): Promise<IPermiso> {
        return this._repository.findOne(id);
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IPermiso[]> {
        if (!this._sortableColumns.includes(sortBy)) {
            sortBy = "id";
        }
        return this._repository.find({
            order: {
                [sortBy]: orderBy as OrderBy,
            },
            take: limit,
            skip: page * limit - limit,
        });
    }
    async permisoStatus(permiso: string, id?: number): Promise<any> {
        const result = await this._repository
            .createQueryBuilder("Permiso")
            .where("Permiso.permiso= :permiso", { permiso })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "El permiso ya se encuentra registrado.",
            },
        };
    }
    async search(permiso: string): Promise<IPermiso[]> {
        return this._repository
            .createQueryBuilder("Permiso")
            .where("Permiso.permiso LIKE :permiso", {
                permiso: `%${permiso}%`,
            })
            .orderBy("Permiso.permiso", "ASC")
            .limit(6)
            .getMany();
    }
}
