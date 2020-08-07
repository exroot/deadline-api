import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { Permiso } from "./Permiso";
import { Bitacora } from "./Bitacora";

@Entity({ name: "recursos" })
export class Recurso extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    recurso: string;

    @OneToMany((type) => Permiso, (permiso) => permiso.recurso)
    permisos: Permiso[];

    @OneToMany((type) => Bitacora, (bitacora) => bitacora.usuario)
    bitacoras: Bitacora[];
}
