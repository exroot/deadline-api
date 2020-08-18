import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    ManyToMany,
    BaseEntity,
    DeleteDateColumn,
} from "typeorm";
import { Carrera } from "./Carrera";
import { Tarea } from "./Tarea";
import { Profesor } from "./Profesor";

@Entity({ name: "materias" })
export class Materia extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    materia: string;

    @Column({ type: "int" })
    carrera_id: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne((type) => Carrera, (carrera) => carrera.materias)
    @JoinColumn({ name: "carrera_id" })
    carrera: Carrera;

    @OneToMany((type) => Tarea, (tarea) => tarea.materia)
    tareas: Tarea[];

    @ManyToMany((type) => Profesor, (profesor) => profesor.materias)
    profesores: Profesor[];
}
