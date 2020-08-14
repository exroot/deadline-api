import { createConnection, Connection } from "typeorm";
import { DBConfig } from "./config/database";

export async function getDbConnection(): Promise<Connection> {
    try {
        const conn = await createConnection(DBConfig);
        return conn;
    } catch (err) {
        throw err;
    }
}
