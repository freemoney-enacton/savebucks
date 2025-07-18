import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("pages")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("slug", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("name", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("title", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("content", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("exclude_seo", "boolean", (col) => col.notNull())
.addColumn("status", sql<any>`enum('publish','trash','draft','')`, (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("pages").execute();
}