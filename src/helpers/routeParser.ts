const methodToOperacion = {
    GET: "Read",
    POST: "Create",
    PATCH: "Update",
    DELETE: "Delete",
};

const routeToRecurso = {
    bitacora: "Bitacora",
    carreras: "Carrera",
    categorias: "Categoria",
    materias: "Materia",
    operaciones: "Operacion",
    permisos: "Permiso",
    profesores: "Profesor",
    recursos: "Recurso",
    roles: "Rol",
    tareas: "Tarea",
    usuarios: "Usuario",
};

export const extractData = (request: any) => {
    const arrayPath: string[] = request.path.split("/");
    const { method } = request;
    const route = arrayPath[1];
    const recursoLabel: string = routeToRecurso[route];
    const operacionLabel: string = methodToOperacion[method];
    let elemento_id: string;
    if (arrayPath.length > 2) {
        // It's a element route
        elemento_id = arrayPath[2];
    } else {
        // It's a collection route
        if (method === "GET") {
            // GET is the only http method which can be applied to a collection route
            elemento_id = "All";
        } else {
            elemento_id = null;
        }
    }

    return {
        recursoLabel,
        operacionLabel,
        elemento_id,
    };
};
