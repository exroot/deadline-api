import { Repository } from "typeorm";
import { IRecurso, IConflictResponse } from "../constants/interfaces";
import { inject } from "inversify";
import { TYPE } from "../constants/types";
import { BaseService } from "./base.service";
import { AnyCnameRecord } from "dns";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class RecursoService extends BaseService {
    constructor(
        @inject(TYPE.RecursoRepository)
        recursoReposiotry: Repository<IRecurso>
    ) {
        super(recursoReposiotry, { useSoftDeletes: true });
    }
    get(id: number): Promise<IRecurso> {
        return this._repository.findOne(id);
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IRecurso[]> {
        return this._repository.find({
            order: {
                [sortBy]: orderBy as OrderBy,
            },
            take: limit,
            skip: page * limit - limit,
        });
    }
    async getByRecurso(recurso: string): Promise<IRecurso> {
        const result = await this._repository
            .createQueryBuilder("Recurso")
            .where("Recurso.nombre= :recurso", { recurso })
            .getOne();
        return result;
    }

    async recursoStatus(
        recurso: string,
        id?: number
    ): Promise<IConflictResponse> {
        const result = await this._repository
            .createQueryBuilder("Recurso")
            .where("Recurso.nombre= :recurso", { recurso })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "El recurso ya se encuentra registrado.",
            },
        };
    }

    async search(recurso: string): Promise<IRecurso[]> {
        return this._repository
            .createQueryBuilder("Recurso")
            .where("Recurso.nombre LIKE :nombre", {
                nombre: `%${recurso}%`,
            })
            .orderBy("Recurso.nombre", "ASC")
            .limit(6)
            .getMany();
    }
}
