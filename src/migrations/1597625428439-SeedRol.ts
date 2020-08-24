import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { RolSeed } from "../seeds";
import { Rol } from "../entities";

export class SeedRol1597625428439 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(Rol).save(RolSeed);
        return;
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
