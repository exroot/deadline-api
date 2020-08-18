import {
    Entity,
    PrimaryColumn,
    BaseEntity,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    DeleteDateColumn,
} from "typeorm";
import { Materia } from "./Materia";
import { Profesor } from "./Profesor";
import { Categoria } from "./Categoria";
import { Usuario } from "./Usuario";

@Entity({ name: "tareas" })
export class Tarea extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    ponderacion: number;

    @Column("text")
    descripcion: string;

    @Column({ type: "timestamp" })
    fecha_asignacion: Date;

    @Column({ type: "timestamp" })
    fecha_entrega: Date;

    @Column()
    fuente: string;

    @Column({ type: "int" })
    usuario_id: number;

    @Column({ type: "int" })
    materia_id: number;

    @Column({ type: "int" })
    profesor_id: number;

    @DeleteDateColumn()
    deletedAt: Date;

    // Usuario
    @ManyToOne((type) => Usuario, (usuario) => usuario.tareasPublicadas)
    @JoinColumn({ name: "usuario_id" })
    autor: Usuario;

    // Materia
    @ManyToOne((type) => Materia, (materia) => materia.tareas)
    @JoinColumn({ name: "materia_id" })
    materia: Materia;

    // Profesor
    @ManyToOne((type) => Profesor, (profesor) => profesor.tareas)
    @JoinColumn({ name: "profesor_id" })
    profesor: Profesor;

    // Categorias
    @ManyToMany((type) => Categoria, (categoria) => categoria.tareas)
    @JoinTable({
        name: "tareas_categorias",
        joinColumn: {
            name: "tarea_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "categoria_id",
            referencedColumnName: "id",
        },
    })
    categorias: Categoria[];
}
