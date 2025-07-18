import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("translations")
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("page", sql<any>`varchar(100)`, (col) => col.notNull())
    .addColumn("module", sql<any>`varchar(100)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("trans_key", sql<any>`varchar(100)`, (col) => col.notNull())
    .addColumn("trans_value", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("translations").execute();
}