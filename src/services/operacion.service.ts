import { Repository } from "typeorm";
import { IOperacion, IConflictResponse } from "../constants/interfaces";
import { inject } from "inversify";
import { TYPE } from "../constants/types";
import { BaseService } from "./base.service";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class OperacionService extends BaseService {
    constructor(
        @inject(TYPE.OperacionRepository)
        operacionRepository: Repository<IOperacion>
    ) {
        super(operacionRepository, { useSoftDeletes: true });
    }
    get(id: number): Promise<IOperacion> {
        return this._repository.findOne(id);
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IOperacion[]> {
        return this._repository.find({
            order: {
                [sortBy]: orderBy as OrderBy,
            },
            take: limit,
            skip: page * limit - limit,
        });
    }
    async getByOperacion(operacion: string) {
        const result = await this._repository
            .createQueryBuilder("Operacion")
            .where("Operacion.operacion= :operacion", { operacion })
            .getOne();
        return result;
    }
    async operacionStatus(
        operacion: string,
        id?: number
    ): Promise<IConflictResponse> {
        const result = await this._repository
            .createQueryBuilder("Operacion")
            .where("Operacion.operacion= :operacion", { operacion })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "La operacion ya se encuentra registrada.",
            },
        };
    }
    async search(operacion: string): Promise<IOperacion[]> {
        return this._repository
            .createQueryBuilder("Operacion")
            .where("Operacion.operacion LIKE :operacion", {
                operacion: `%${operacion}%`,
            })
            .orderBy("Operacion.operacion", "ASC")
            .limit(6)
            .getMany();
    }
}
