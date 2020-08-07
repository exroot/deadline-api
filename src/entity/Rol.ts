import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Permiso } from "./Permiso";

@Entity({ name: "roles" })
export class Rol extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rol: string;

    @OneToMany((type) => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];

    @ManyToMany((type) => Permiso, (permiso) => permiso.roles)
    @JoinTable({
        name: "roles_permisos",
        joinColumn: {
            name: "rol_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "permiso_id",
            referencedColumnName: "id",
        },
    })
    permisos: Permiso[];
}
