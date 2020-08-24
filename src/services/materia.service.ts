import { Repository } from "typeorm";
import { IMateria, IConflictResponse } from "../constants/interfaces";
import { inject } from "inversify";
import { TYPE } from "../constants/types";
import { BaseService } from "./base.service";
import { Materia } from "../entities";

type OrderBy = "ASC" | "DESC";

export class MateriaService extends BaseService {
    private readonly _relations: string[];
    private readonly _sortableColumns: string[];
    constructor(
        @inject(TYPE.MateriaRepository)
        materiaRepository: Repository<IMateria>
    ) {
        super(materiaRepository, { useSoftDeletes: true });
        this._relations = ["carrera", "profesores"];
        this._sortableColumns = ["id", "materia", "carrera"];
    }
    get(id: number): Promise<IMateria> {
        return this._repository.findOne(id, {
            relations: this._relations,
        });
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IMateria[]> {
        if (!this._sortableColumns.includes(sortBy)) {
            sortBy = "Materia.id";
        }
        if (sortBy === "carrera") {
            sortBy += ".carrera";
        }
        return this._repository
            .createQueryBuilder("Materia")
            .leftJoinAndSelect("Materia.carrera", "carrera")
            .leftJoinAndSelect("Materia.profesores", "profesores")
            .orderBy(sortBy, orderBy as OrderBy)
            .take(limit)
            .skip(page * limit - limit)
            .getMany();
    }
    async create(newData: any): Promise<any> {
        const materia: Materia = await this._repository.save(newData);
        if (newData.profesores) {
            await this._repository
                .createQueryBuilder("Materia")
                .relation("Materia", "profesores")
                .of(materia)
                .add(newData.profesores);
        }
        return materia;
    }
    async update(id: number, updatedData: any): Promise<any> {
        const { profesores, ...data } = updatedData;
        await this._repository.update(id, data);
        if (profesores) {
            const viejosProfesores = await this._repository
                .createQueryBuilder("Materia")
                .relation("Materia", "profesores")
                .of(id)
                .loadMany();
            await this._repository
                .createQueryBuilder("Materia")
                .relation("Materia", "profesores")
                .of(id)
                .addAndRemove(profesores, viejosProfesores);
        }

        return;
    }

    async materiaStatus(
        materia: string,
        id?: number
    ): Promise<IConflictResponse> {
        const result = await this._repository
            .createQueryBuilder("Materia")
            .where("Materia.materia= :materia", { materia })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "La materia ya se encuentra registrada.",
            },
        };
    }
    async search(materia: string): Promise<IMateria[]> {
        return this._repository
            .createQueryBuilder("Materia")
            .where("Materia.materia LIKE :materia", {
                materia: `%${materia}%`,
            })
            .orderBy("Materia.materia", "ASC")
            .limit(6)
            .getMany();
    }
}
