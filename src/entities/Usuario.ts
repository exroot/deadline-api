import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    JoinColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    DeleteDateColumn,
} from "typeorm";
import { Carrera } from "./Carrera";
import { Rol } from "./Rol";
import { Tarea } from "./Tarea";
import { Bitacora } from "./Bitacora";
import bcrypt, { hashSync } from "bcrypt";

@Entity({ name: "usuarios" })
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    imagen: string;

    @Column({ type: "int" })
    carrera_id: number;

    @Column({ type: "int", default: 1 })
    rol_id: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => Tarea, (tarea) => tarea.autor)
    tareasPublicadas: Tarea[];

    @ManyToOne((type) => Carrera, (carrera) => carrera.usuarios)
    @JoinColumn({ name: "carrera_id" })
    carrera: Carrera;

    @ManyToOne((type) => Rol, (rol) => rol.usuarios)
    @JoinColumn({ name: "rol_id" })
    rol: Rol;

    @OneToMany((type) => Bitacora, (bitacora) => bitacora.usuario)
    bitacoras: Bitacora[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = hashSync(
                this.password,
                parseInt(process.env.HASH_SALT)
            );
        }
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
