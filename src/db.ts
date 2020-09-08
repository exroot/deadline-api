import { createConnection, Connection, ConnectionOptions } from "typeorm";
import * as DBConfig from "./config/database";

export async function getDbConnection(): Promise<Connection> {
    try {
        const conn = await createConnection(DBConfig as ConnectionOptions);
        await conn.runMigrations();
        return conn;
    } catch (err) {
        throw err;
    }
}
