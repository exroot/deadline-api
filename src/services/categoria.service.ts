import { Repository } from "typeorm";
import { ICategoria, IConflictResponse } from "../constants/interfaces";
import { inject } from "inversify";
import { TYPE } from "../constants/types";
import { BaseService } from "./base.service";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class CategoriaService extends BaseService {
    private readonly _sortableColumns: string[];
    constructor(
        @inject(TYPE.CategoriaRepository)
        categoriaRepository: Repository<ICategoria>
    ) {
        super(categoriaRepository, { useSoftDeletes: true });
        this._sortableColumns = ["id", "categoria"];
    }
    get(id: number): Promise<ICategoria> {
        return this._repository.findOne(id);
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<ICategoria[]> {
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
    async categoriaStatus(
        categoria: string,
        id?: number
    ): Promise<IConflictResponse> {
        const result = await this._repository
            .createQueryBuilder("Categoria")
            .where("categoria.categoria= :categoria", { categoria })
            .getOne();
        return {
            conflict: !!result && result.id !== id,
            conflictData: {
                name: "Conflict",
                message: "La categoria ya se encuentra registrada.",
            },
        };
    }
    async search(categoria: string): Promise<ICategoria[]> {
        return this._repository
            .createQueryBuilder("Categoria")
            .where("Categoria.categoria LIKE :categoria", {
                categoria: `%${categoria}%`,
            })
            .orderBy("Categoria.categoria", "ASC")
            .limit(6)
            .getMany();
    }
}
