import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { Bitacora } from "./Bitacora";

@Entity({ name: "operaciones" })
export class Operacion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    operacion: string;

    @OneToMany((type) => Bitacora, (bitacora) => bitacora.usuario)
    bitacoras: Bitacora[];
}
