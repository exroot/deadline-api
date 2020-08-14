import { AsyncContainerModule } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { Repository, getRepository } from "typeorm";
import { entities } from "./entities";
import { customMiddlewares as middlewares } from "./middlewares";
import { services } from "./services";
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

        /* Registering controllers */
        console.log(`Registering controllers...`);
        await require("./controllers/auth.controller");
        await require("./controllers/usuario.controller");
        await require("./controllers/carrera.controller");

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
