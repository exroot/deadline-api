import { BaseService } from "./base.service";
import { Repository } from "typeorm";
import { inject } from "inversify";
import { ITarea } from "../constants/interfaces";
import { TYPE } from "../constants/types";

type OrderBy = "ASC" | "DESC" | 1 | -1;

export class TareaService extends BaseService {
    private readonly _sortableColumns: string[];
    private readonly _relations: string[];
    constructor(@inject(TYPE.TareaRepository) tareaRepo: Repository<ITarea>) {
        super(tareaRepo, { useSoftDeletes: true });
        this._relations = ["autor", "materia", "profesor", "categorias"];
        this._sortableColumns = ["id", "titulo", "materia", "profesor"];
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
            order: {
                [sortBy]: orderBy as OrderBy,
            },
            skip: page * limit - limit,
        });
    }
    async create(newData: any): Promise<any> {
        const tarea = await this._repository.save(newData);
        if (newData.categorias) {
            await this._repository
                .createQueryBuilder("Tarea")
                .relation("Tarea", "categorias")
                .of(tarea)
                .add(newData.categorias);
        }
        return tarea;
    }
    async update(id: number, updatedData: any): Promise<any> {
        const { categorias, ...data } = updatedData;
        await this._repository.update(id, data);
        if (categorias) {
            const olders = await this._repository
                .createQueryBuilder("Tarea")
                .relation("Tarea", "categorias")
                .of(id)
                .loadMany();
            await this._repository
                .createQueryBuilder("Tarea")
                .relation("Tarea", "categorias")
                .of(id)
                .addAndRemove(updatedData.categorias, olders);
        }
        return;
    }
    async search(titulo: string): Promise<ITarea[]> {
        return this._repository
            .createQueryBuilder("Tarea")
            .where("Tarea.titulo LIKE :titulo", {
                titulo: `%${titulo}%`,
            })
            .orderBy("Recurso.fecha_entrega", "DESC")
            .limit(6)
            .getMany();
    }
}
