import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("bonus_types")
    .addColumn("id", "bigint", (col) => col.notNull())
    .addColumn("code", sql<any>`varchar(25)`, (col) => col.notNull())
    .addColumn("name", sql<any>`longtext`, (col) => col.notNull())
    .addColumn("amount", "text", (col) => col.notNull())
    .addColumn("qualifying_amount", "integer", (col) => col.notNull())
    .addColumn("validity_days", "integer", (col) => col.notNull().defaultTo(sql<any>`90`))
    .addColumn("enabled", "boolean", (col) => col.notNull().defaultTo(sql<any>`1`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("bonus_types").execute();
}