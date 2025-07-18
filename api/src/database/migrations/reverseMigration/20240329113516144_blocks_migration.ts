import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("blocks")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("name", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("purpose", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("title", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("description", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("content", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("blocks", sql<any>`longtext`, (col) => col.notNull())
.addColumn("status", sql<any>`enum('publish','trash','draft','')`, (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("blocks").execute();
}