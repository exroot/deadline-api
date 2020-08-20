import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToMany,
    DeleteDateColumn,
} from "typeorm";
import { Rol } from "./Rol";

@Entity({ name: "permisos" })
export class Permiso extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    permiso: string;

    @DeleteDateColumn({ select: false })
    deletedAt: Date;

    @ManyToMany((type) => Rol, (rol) => rol.permisos)
    roles: Rol[];
}
