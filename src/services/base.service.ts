import { Repository } from "typeorm";
import { injectable, unmanaged } from "inversify";

export interface BaseServiceOptParam {
    useSoftDeletes: boolean;
}

@injectable()
export abstract class BaseService {
    protected readonly _repository: Repository<any>;
    protected readonly _useSoftDeletes: boolean;
    constructor(
        repository: Repository<any>,
        @unmanaged() opt?: BaseServiceOptParam
    ) {
        this._repository = repository;
        this._useSoftDeletes = opt?.useSoftDeletes || false;
    }
    abstract async get(id: number): Promise<any>;
    abstract async getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<any[]>;
    async create(newData: any): Promise<any> {
        return this._repository.save(newData);
    }
    async update(id: number, updatedData: any): Promise<any> {
        return this._repository.update(id, updatedData);
    }
    async delete(id: number): Promise<any> {
        if (this._useSoftDeletes) {
            return this._repository.softDelete(id);
        }
        return this._repository.delete(id);
    }
}
