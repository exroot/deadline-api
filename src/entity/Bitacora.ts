import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Operacion } from "./Operacion";
import { Recurso } from "./Recurso";

@Entity({ name: "bitacora" })
export class Bitacora extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @Column({ type: "int" })
    elemento_id: number;

    // Usuario
    @ManyToOne((type) => Usuario, (usuario) => usuario.bitacoras)
    @JoinColumn({ name: "usuario_id" })
    usuario: Usuario;

    @Column({ type: "int", nullable: true })
    usuario_id: number;

    // Operacion
    @ManyToOne((type) => Operacion, (operacion) => operacion.bitacoras)
    @JoinColumn({ name: "operacion_id" })
    operacion: Operacion;

    @Column({ type: "int", nullable: true })
    operacion_id: number;

    // Recurso
    @ManyToOne((type) => Recurso, (recurso) => recurso.bitacoras)
    @JoinColumn({ name: "recurso_id" })
    recurso: Recurso;

    @Column({ type: "int", nullable: true })
    recurso_id: number;
}
