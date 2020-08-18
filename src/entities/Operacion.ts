import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    DeleteDateColumn,
} from "typeorm";
import { Bitacora } from "./Bitacora";

@Entity({ name: "operaciones" })
export class Operacion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    operacion: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => Bitacora, (bitacora) => bitacora.usuario)
    bitacoras: Bitacora[];
}
