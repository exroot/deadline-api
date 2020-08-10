import { Bitacora } from "./Bitacora";
import { Carrera } from "./Carrera";
import { Categoria } from "./Categoria";
import { Materia } from "./Materia";
import { Operacion } from "./Operacion";
import { Permiso } from "./Permiso";
import { Profesor } from "./Profesor";
import { Recurso } from "./Recurso";
import { Rol } from "./Rol";
import { Tarea } from "./Tarea";
import { Usuario } from "./Usuario";

export const entities = [
    { entity: Usuario, typename: "UsuarioRepository" },
    { entity: Carrera, typename: "CarreraRepository" },
];
export { Usuario, Carrera };
