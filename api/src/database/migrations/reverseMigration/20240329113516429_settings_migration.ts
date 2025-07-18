import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("settings")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("name", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("val", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("group", sql<any>`varchar(255)`, (col) => col.notNull().defaultTo(sql<any>`'default'`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("settings").execute();
}