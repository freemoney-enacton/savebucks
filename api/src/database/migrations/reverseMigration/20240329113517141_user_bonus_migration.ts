import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("user_bonus")
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("user_id", "integer", (col) => col.notNull())
    .addColumn("bonus_code", sql<any>`varchar(25)`, (col) => col.notNull())
    .addColumn("amount", "text", (col) => col.notNull())
    .addColumn("awarded_on", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("expires_on", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("referred_bonus_id", "integer", (col) => col.defaultTo(sql<any>`NULL`))
.addColumn("status", sql<any>`enum('pending','confirmed','declined')`, (col) => col.notNull().defaultTo(sql<any>`'pending'`))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("admin_note", sql<any>`varchar(500)`, (col) => col.defaultTo(sql<any>`NULL`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_bonus").execute();
}