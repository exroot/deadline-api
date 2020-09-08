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
    { entity: Bitacora, typename: "BitacoraRepository" },
    { entity: Carrera, typename: "CarreraRepository" },
    { entity: Categoria, typename: "CategoriaRepository" },
    { entity: Materia, typename: "MateriaRepository" },
    { entity: Operacion, typename: "OperacionRepository" },
    { entity: Permiso, typename: "PermisoRepository" },
    { entity: Profesor, typename: "ProfesorRepository" },
    { entity: Recurso, typename: "RecursoRepository" },
    { entity: Rol, typename: "RolRepository" },
    { entity: Tarea, typename: "TareaRepository" },
    { entity: Usuario, typename: "UsuarioRepository" },
];
export {
    Bitacora,
    Carrera,
    Categoria,
    Materia,
    Operacion,
    Permiso,
    Profesor,
    Recurso,
    Rol,
    Tarea,
    Usuario,
};
