import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    DeleteDateColumn,
} from "typeorm";
import { Materia } from "./Materia";
import { Usuario } from "./Usuario";

@Entity({ name: "carreras" })
export class Carrera extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    carrera: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => Materia, (materia) => materia.carrera)
    materias: Materia[];

    @OneToMany((type) => Usuario, (usuario) => usuario.carrera)
    usuarios: Usuario[];
}
