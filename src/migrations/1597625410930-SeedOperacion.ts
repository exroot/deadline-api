import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { OperacionSeed } from "../seeds";
import { Operacion } from "../entities";

export class SeedOperacion1597625410930 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(Operacion).save(OperacionSeed);
        return;
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
