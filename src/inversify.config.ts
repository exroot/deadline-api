import { AsyncContainerModule } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { Repository, getRepository } from "typeorm";
import { entities } from "./entities";
import { customMiddlewares as middlewares } from "./middlewares";
import { extractData } from "./helpers/routeParser";
import { services } from "./services";
import { Schema } from "yup";
import { schemas } from "./constants/schemas";
import { TYPE } from "./constants/types";
import { getDbConnection } from "./db";
export const bindings = new AsyncContainerModule(async (bind) => {
    try {
        await getDbConnection();
        /*******************************************************
         *    Registering CUSTOM middlewares
         *    - EX:
         *     bind<BaseMiddleware>(TYPE.Authenticated).to(Authenticated);
         ******************************************************/
        console.log(`Registering custom middlewares...`);
        middlewares.forEach(({ middleware, typename }) => {
            bind<BaseMiddleware>(TYPE[`${typename}`]).to(middleware);
        });

        /* Registering validation schemas */
        schemas.forEach(({ schema, typename }) => {
            bind<Schema<any>>(TYPE[`${typename}`]).toConstantValue(schema);
        });

        /* Registering helpers */
        bind<any>(TYPE.RouteParserHelper).toConstantValue(extractData);

        /* Registering controllers */
        console.log(`Registering controllers...`);
        await require("./controllers/auth.controller");
        await require("./controllers/bitacora.controller");
        await require("./controllers/carrera.controller");
        await require("./controllers/categoria.controller");
        await require("./controllers/materia.controller");
        await require("./controllers/operacion.controller");
        await require("./controllers/permiso.controller");
        await require("./controllers/profesor.controller");
        await require("./controllers/recurso.controller");
        await require("./controllers/rol.controller");
        await require("./controllers/tarea.controller");
        await require("./controllers/usuario.controller");

        /*******************************************************
         *    Registering services
         *    - EX:
         *    bind<CarreraService>(TYPE.CarreraService)
         *       .to(CarreraService)
         *       .inSingletonScope();
         ******************************************************/
        console.log(`Registering services...`);
        services.forEach(({ service, typename }) => {
            bind<any>(TYPE[`${typename}`]).to(service).inSingletonScope();
        });

        /*******************************************************
         *    Registering entities as repositories
         *    - EX:
         *    bind<Repository<Carrera>>(TYPE.CarreraRepository)
         *        .toDynamicValue(() => {
         *            return getRepository(Carrera);
         *        })
         *        .inRequestScope();
         ******************************************************/
        console.log(`Registering entities/repositories...`);
        entities.forEach(({ entity, typename }) => {
            bind<Repository<any>>(TYPE[`${typename}`])
                .toDynamicValue(() => {
                    return getRepository(entity);
                })
                .inRequestScope();
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
});
