import { BaseService } from "./base.service";
import { Repository } from "typeorm";
import { inject } from "inversify";
import { ICarrera, IConflictResponse } from "../constants/interfaces";
import { TYPE } from "../constants/types";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class CarreraService extends BaseService {
    private readonly _relations: string[];
    constructor(
        @inject(TYPE.CarreraRepository) carreraRepo: Repository<ICarrera>
    ) {
        super(carreraRepo, { useSoftDeletes: false });
    }
    get(id: number): Promise<ICarrera> {
        return this._repository.findOne(id, {
            relations: this._relations,
        });
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<ICarrera[]> {
        return this._repository.find({
            order: {
                [sortBy]: orderBy as OrderBy,
            },
            take: limit,
            skip: page * limit - limit,
        });
    }
    async carreraStatus(
        carrera: string,
        id?: number
    ): Promise<IConflictResponse> {
        const result = await this._repository
            .createQueryBuilder("Carrera")
            .where("Carrera.carrera= :carrera", { carrera })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "La carrera ya se encuentra registrada.",
            },
        };
    }
    async search(carrera: string): Promise<ICarrera[]> {
        return this._repository
            .createQueryBuilder("Carrera")
            .where("Carrera.carrera LIKE :carrera", {
                carrera: `%${carrera}%`,
            })
            .orderBy("Carrera.carrera", "ASC")
            .limit(6)
            .getMany();
    }
}
