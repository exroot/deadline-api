import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Tarea } from "./Tarea";
import { Materia } from "./Materia";

@Entity({ name: "profesores" })
export class Profesor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    email: string;

    @Column()
    numero: string;

    @OneToMany((type) => Tarea, (tarea) => tarea.profesor)
    tareas: Tarea[];

    @ManyToMany((type) => Materia, (materia) => materia.profesores)
    @JoinTable({
        name: "materias_profesores",
        joinColumn: {
            name: "profesor_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "materia_id",
            referencedColumnName: "id",
        },
    })
    materias: Materia[];
}
