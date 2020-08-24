import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { RecursoSeed } from "../seeds";
import { Recurso } from "../entities";

export class SeedRecurso1597625404830 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(Recurso).save(RecursoSeed);
        return;
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
