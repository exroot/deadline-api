import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { CategoriaSeed } from "../seeds";
import { Categoria } from "../entities";

export class SeedCategoria1597625393469 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(Categoria).save(CategoriaSeed);
        return;
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
