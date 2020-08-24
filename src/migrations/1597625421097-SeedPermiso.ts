import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { PermisoSeed } from "../seeds";
import { Permiso } from "../entities";

export class SeedPermiso1597625421097 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(Permiso).save(PermisoSeed);
        return;
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
