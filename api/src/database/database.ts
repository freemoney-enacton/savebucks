import { DB } from "./db"; // this is the Database interface we defined earlier
import { createPool } from "mysql2"; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from "kysely";
import { config } from "../config/config";

const dialect = new MysqlDialect({
  pool: createPool({
    database: config.env.database.name,
    host: config.env.database.host,
    user: config.env.database.user,
    password: config.env.database.password,
    port: Number(config.env.database.port),
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
