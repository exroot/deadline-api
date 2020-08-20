import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToMany,
    DeleteDateColumn,
} from "typeorm";
import { Tarea } from "./Tarea";

@Entity({ name: "categorias" })
export class Categoria extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    categoria: string;

    @DeleteDateColumn({ select: false })
    deletedAt: Date;

    @ManyToMany((type) => Tarea, (tarea) => tarea.categorias)
    tareas: Tarea[];
}
