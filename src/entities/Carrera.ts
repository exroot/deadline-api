import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { Materia } from "./Materia";
import { Usuario } from "./Usuario";

@Entity({ name: "carreras" })
export class Carrera extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    carrera: string;

    @OneToMany((type) => Materia, (materia) => materia.carrera)
    materias: Materia[];

    @OneToMany((type) => Usuario, (usuario) => usuario.carrera)
    usuarios: Usuario[];
}
