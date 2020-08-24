import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { CarreraSeed } from "../seeds";
import { Carrera } from "../entities";

export class SeedCarrera1597625083494 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(Carrera).save(CarreraSeed);
        return;
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
