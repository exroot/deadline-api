import {
    Entity,
    PrimaryColumn,
    BaseEntity,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
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

    @Column()
    fecha_asignacion: Date;

    @Column()
    fecha_entrega: Date;

    @Column()
    fuente: string;

    // Usuario
    @ManyToOne((type) => Usuario, (usuario) => usuario.tareas)
    @JoinColumn({ name: "usuario_id" })
    usuario: Usuario;

    @Column({ type: "int", nullable: true })
    usuario_id: number;

    // Materia
    @ManyToOne((type) => Materia, (materia) => materia.tareas)
    @JoinColumn({ name: "materia_id" })
    materia: Materia;

    @Column({ type: "int", nullable: true })
    materia_id: number;

    // Profesor
    @ManyToOne((type) => Profesor, (profesor) => profesor.tareas)
    @JoinColumn({ name: "profesor_id" })
    profesor: Profesor;

    @Column({ type: "int", nullable: true })
    profesor_id: number;

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
