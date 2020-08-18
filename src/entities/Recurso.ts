import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    DeleteDateColumn,
} from "typeorm";
import { Bitacora } from "./Bitacora";

@Entity({ name: "recursos" })
export class Recurso extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => Bitacora, (bitacora) => bitacora.recurso)
    bitacoras: Bitacora[];
}
