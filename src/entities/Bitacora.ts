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

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date;

    @Column({ nullable: true })
    data: string;

    @Column({ type: "int" })
    usuario_id: number;

    @Column({ type: "int" })
    operacion_id: number;

    @Column({ type: "int" })
    recurso_id: number;

    // Usuario
    @ManyToOne((type) => Usuario, (usuario) => usuario.bitacoras)
    @JoinColumn({ name: "usuario_id" })
    usuario: Usuario;

    // Operacion
    @ManyToOne((type) => Operacion, (operacion) => operacion.bitacoras)
    @JoinColumn({ name: "operacion_id" })
    operacion: Operacion;

    // Recurso
    @ManyToOne((type) => Recurso, (recurso) => recurso.bitacoras)
    @JoinColumn({ name: "recurso_id" })
    recurso: Recurso;
}
