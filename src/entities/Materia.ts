import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    ManyToMany,
    BaseEntity,
} from "typeorm";
import { Carrera } from "./Carrera";
import { Tarea } from "./Tarea";
import { Profesor } from "./Profesor";

@Entity({ name: "materias" })
export class Materia extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    materia: string;

    @ManyToOne((type) => Carrera, (carrera) => carrera.materias)
    @JoinColumn({ name: "carrera_id" })
    carrera: Carrera;

    @Column({ type: "int", nullable: true })
    carrera_id: number;

    @OneToMany((type) => Tarea, (tarea) => tarea.materia)
    tareas: Tarea[];

    @ManyToMany((type) => Profesor, (profesor) => profesor.materias)
    profesores: Profesor[];

    @Column()
    deleted: boolean;
}
