import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("user_payments")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("payment_id", "bigint", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) => col.notNull())
    .addColumn("payment_method_code", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("account", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("payment_input", sql<any>`longtext`, (col) => col.notNull())
    .addColumn("amount", "bigint", (col) => col.notNull())
    .addColumn("cashback_amount", "bigint", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("bonus_amount", "bigint", (col) => col.defaultTo(sql<any>`NULL`))
.addColumn("status", sql<any>`enum('created','processing','completed','declined')`, (col) => col.notNull())
    .addColumn("api_response", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("api_reference_id", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("api_status", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("note", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("admin_note", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("paid_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_payments").execute();
}