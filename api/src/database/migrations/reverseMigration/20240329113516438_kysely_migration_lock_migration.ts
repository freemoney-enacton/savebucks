import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("kysely_migration_lock")
    .addColumn("id", sql<any>`varchar(255)`, (col) => col.primaryKey().notNull())
    .addColumn("is_locked", "integer", (col) => col.notNull().defaultTo(sql<any>`0`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("kysely_migration_lock").execute();
}