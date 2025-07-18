import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("kysely_migration")
    .addColumn("name", sql<any>`varchar(255)`, (col) => col.primaryKey().notNull())
    .addColumn("timestamp", sql<any>`varchar(255)`, (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("kysely_migration").execute();
}