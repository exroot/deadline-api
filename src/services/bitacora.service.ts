import { inject, injectable } from "inversify";
import { TYPE } from "../constants/types";
import { IBitacora, INotFoundResponse } from "../constants/interfaces";
import { Repository, Between } from "typeorm";

type OrderBy = "ASC" | "DESC";

@injectable()
export class BitacoraService {
    protected readonly _repository: Repository<IBitacora>;
    private readonly _relations: string[];
    private readonly _sortableColumns: string[];
    constructor(
        @inject(TYPE.BitacoraRepository)
        bitacoraRepository: Repository<IBitacora>
    ) {
        this._repository = bitacoraRepository;
        this._relations = ["usuario", "operacion", "recurso"];
        this._sortableColumns = [
            "usuario",
            "operacion",
            "recurso",
            "timestamp",
        ];
    }
    get(id: number): Promise<IBitacora> {
        return this._repository.findOne(id, {
            relations: this._relations,
        });
    }
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IBitacora[]> {
        if (!this._sortableColumns.includes(sortBy)) {
            sortBy = "Bitacora.timestamp";
        }
        if (sortBy === "usuario") {
            sortBy += ".username";
        } else if (sortBy === "operacion") {
            sortBy += ".operacion";
        } else if (sortBy === "recurso") {
            sortBy += ".nombre";
        }
        return this._repository
            .createQueryBuilder("Bitacora")
            .leftJoinAndSelect("Bitacora.usuario", "usuario")
            .leftJoinAndSelect("Bitacora.operacion", "operacion")
            .leftJoinAndSelect("Bitacora.recurso", "recurso")
            .orderBy(sortBy, orderBy as OrderBy)
            .take(limit)
            .skip(page * limit - limit)
            .getMany();
    }
    getManyByUsuario(
        usuarioId: number,
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IBitacora[]> {
        return this._repository.find({
            where: {
                usuario_id: usuarioId,
            },
            relations: this._relations,
            order: {
                [sortBy]: orderBy,
            },
            take: limit,
            skip: page * limit - limit,
        });
    }
    getManyByFechas(
        fechas: Date[],
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IBitacora[]> {
        return this._repository.find({
            where: {
                fecha: Between(fechas[0], fechas[1]),
            },
            relations: this._relations,
            order: {
                [sortBy]: orderBy,
            },
            take: limit,
            skip: page * limit - limit,
        });
    }
    audit(
        data: string,
        usuarioId: number,
        operacionId: number,
        recursoId: number
    ): Promise<IBitacora> {
        return this._repository
            .create({
                data,
                usuario_id: usuarioId,
                operacion_id: operacionId,
                recurso_id: recursoId,
            })
            .save();
    }

    async existe(id: number): Promise<INotFoundResponse> {
        const existe = await this._repository
            .createQueryBuilder("Bitacora")
            .where("Bitacora.id= :id", { id })
            .getOne();
        return {
            notFound: !existe,
            notFoundData: {
                name: "Not found",
                message: "Recurso no encontrado.",
            },
        };
    }
    async search(options): Promise<IBitacora[]> {
        const { username, email } = options;
        return this._repository
            .createQueryBuilder("Bitacora")
            .leftJoinAndSelect("Bitacora.operacion", "operacion")
            .leftJoinAndSelect("Bitacora.recurso", "recurso")
            .leftJoinAndSelect("Bitacora.usuario", "usuario")
            .where("usuario.username LIKE :username", {
                username: `%${username}%`,
            })
            .orWhere("usuario.email LIKE :email", { email: `%${email}%` })
            .orderBy("Bitacora.timestamp", "DESC")
            .limit(6)
            .getMany();
    }
}
