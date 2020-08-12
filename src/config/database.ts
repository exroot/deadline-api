import { ConnectionOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const DBConfig: ConnectionOptions = {
    type: process.env.DB_CONNECTION as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
        entitiesDir: "src/entities",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
    },
};
