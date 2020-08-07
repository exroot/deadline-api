import "reflect-metadata";
import { createConnection } from "typeorm";
import { Rol } from "./entity/Rol";
import { Permiso } from "./entity/Permiso";
import { Usuario } from "./entity/Usuario";
import { Carrera } from "./entity/Carrera";

const checkPermiso = (permisos: Permiso[], permiso: string) => {
    const perms = permisos.map((p) => p.permiso);
    return perms.includes(permiso);
};

createConnection()
    .then(async (connection) => {
        const usuario = await Usuario.findOne(1, {
            relations: ["rol", "carrera", "rol.permisos"],
        });

        console.log("Loaded permisos: ", usuario.rol.permisos);

        console.log(
            `${
                checkPermiso(usuario.rol.permisos, "Actualizar tarea")
                    ? "Conceed"
                    : "Denegated"
            }`
        );

        console.log(
            "Here you can setup and run express/koa/any other framework."
        );
    })
    .catch((error) => console.log(error));
