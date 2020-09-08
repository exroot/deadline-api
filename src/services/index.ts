import { AuthService } from "./auth.service";
import { BitacoraService } from "./bitacora.service";
import { CarreraService } from "./carrera.service";
import { CategoriaService } from "./categoria.service";
import { RecursoService } from "./recurso.service";
import { MateriaService } from "./materia.service";
import { OperacionService } from "./operacion.service";
import { PermisoService } from "./permiso.service";
import { ProfesorService } from "./profesor.service";
import { RolService } from "./rol.service";
import { TareaService } from "./tarea.service";
import { UsuarioService } from "./usuario.service";

export const services = [
    { service: AuthService, typename: "AuthService" },
    { service: BitacoraService, typename: "BitacoraService" },
    { service: CarreraService, typename: "CarreraService" },
    { service: CategoriaService, typename: "CategoriaService" },
    { service: RecursoService, typename: "RecursoService" },
    { service: MateriaService, typename: "MateriaService" },
    { service: OperacionService, typename: "OperacionService" },
    { service: PermisoService, typename: "PermisoService" },
    { service: ProfesorService, typename: "ProfesorService" },
    { service: RolService, typename: "RolService" },
    { service: TareaService, typename: "TareaService" },
    { service: UsuarioService, typename: "UsuarioService" },
];

export {
    AuthService,
    BitacoraService,
    CarreraService,
    CategoriaService,
    RecursoService,
    MateriaService,
    OperacionService,
    PermisoService,
    ProfesorService,
    RolService,
    TareaService,
    UsuarioService,
};
