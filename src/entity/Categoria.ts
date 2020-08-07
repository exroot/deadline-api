import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToMany,
} from "typeorm";
import { Tarea } from "./Tarea";

@Entity({ name: "categorias" })
export class Categoria extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoria: string;

    @Column()
    deleted: boolean;

    @ManyToMany((type) => Tarea, (tarea) => tarea.categorias)
    tareas: Tarea[];
}
