import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { Carrera } from "./Carrera";
import { Rol } from "./Rol";
import { Tarea } from "./Tarea";
import { Bitacora } from "./Bitacora";

@Entity({ name: "usuarios" })
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    imagen: string;

    @OneToMany((type) => Tarea, (tarea) => tarea.usuario)
    tareas: Tarea[];

    @OneToMany((type) => Bitacora, (bitacora) => bitacora.usuario)
    bitacoras: Bitacora[];

    @ManyToOne((type) => Carrera, (carrera) => carrera.usuarios)
    @JoinColumn({ name: "carrera_id" })
    carrera: Carrera;

    @Column({ type: "int", nullable: true })
    carrera_id: number;

    @ManyToOne((type) => Rol, (rol) => rol.usuarios)
    @JoinColumn({ name: "rol_id" })
    rol: Rol;

    @Column({ type: "int", nullable: true })
    rol_id: number;
}
