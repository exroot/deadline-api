import { Repository } from "typeorm";
import { IProfesor, IConflictResponse } from "../constants/interfaces";
import { inject } from "inversify";
import { TYPE } from "../constants/types";
import { BaseService } from "./base.service";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class ProfesorService extends BaseService {
    private readonly _sortableColumns: string[];
    private readonly _relations: string[];
    constructor(
        @inject(TYPE.ProfesorRepository)
        profesorRepository: Repository<IProfesor>
    ) {
        super(profesorRepository, { useSoftDeletes: true });
        this._relations = ["materias"];
        this._sortableColumns = ["id", "nombre"];
    }
    get(id: number): Promise<IProfesor> {
        return this._repository.findOne(id, {
            relations: this._relations,
        });
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IProfesor[]> {
        if (!this._sortableColumns.includes(sortBy)) {
            sortBy = "id";
        }
        return this._repository.find({
            relations: this._relations,
            order: {
                [sortBy]: orderBy as OrderBy,
            },
            take: limit,
            skip: page * limit - limit,
        });
    }
    async create(newData: any): Promise<any> {
        const profesor = await this._repository.save(newData);
        if (newData.materias) {
            await this._repository
                .createQueryBuilder("Profesor")
                .relation("Profesor", "materias")
                .of(profesor)
                .add(newData.materias);
        }
        return profesor;
    }
    async update(id: number, updatedData: any): Promise<any> {
        const { materias, ...data } = updatedData;
        await this._repository.update(id, data);
        if (materias) {
            const materiasViejas = await this._repository
                .createQueryBuilder("Profesor")
                .relation("Profesor", "materias")
                .of(id)
                .loadMany();
            await this._repository
                .createQueryBuilder("Profesor")
                .relation("Profesor", "materias")
                .of(id)
                .addAndRemove(materias, materiasViejas);
        }

        return;
    }
    async profesorStatus(
        email: string,
        id?: number
    ): Promise<IConflictResponse> {
        const result = await this._repository
            .createQueryBuilder("Profesor")
            .where("Profesor.email= :email", { email })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "El profesor ya se encuentra registrado.",
            },
        };
    }
    async search(options: any): Promise<IProfesor[]> {
        const { nombre, email } = options;
        return this._repository
            .createQueryBuilder("Profesor")
            .where("Profesor.nombre LIKE :nombre", {
                nombre: `%${nombre}%`,
            })
            .orWhere("Profesor.email LIKE :email", { email: `%${email}%` })
            .limit(6)
            .getMany();
    }
}
