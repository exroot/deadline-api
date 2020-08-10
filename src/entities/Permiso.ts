import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Rol } from "./Rol";
import { Recurso } from "./Recurso";

@Entity({ name: "permisos" })
export class Permiso extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    permiso: string;

    @ManyToOne((type) => Recurso, (recurso) => recurso.permisos)
    @JoinColumn({ name: "recurso_id" })
    recurso: Recurso;

    @Column({ type: "int", nullable: true })
    recurso_id: number;

    @ManyToMany((type) => Rol, (rol) => rol.permisos)
    roles: Rol[];
}
