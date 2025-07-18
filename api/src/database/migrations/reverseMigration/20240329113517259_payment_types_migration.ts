import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("payment_types")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("code", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("name", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("image", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("account_input_type", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("account_input_label", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("account_input_hint", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("payment_inputs", sql<any>`longtext`, (col) => col.notNull())
    .addColumn("minimum_amount", "text", (col) => col.notNull())
    .addColumn("transaction_fees_amount", "text", (col) => col.defaultTo(sql<any>`NULL`))
.addColumn("transaction_fees_type", sql<any>`enum('fixed','percent')`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("transaction_bonus_amount", "text", (col) => col.defaultTo(sql<any>`NULL`))
.addColumn("transaction_bonus_type", sql<any>`enum('fixed','percent')`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("cashback_allowed", "boolean", (col) => col.notNull().defaultTo(sql<any>`1`))
    .addColumn("bonus_allowed", "boolean", (col) => col.notNull().defaultTo(sql<any>`1`))
    .addColumn("payment_group", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("enabled", "boolean", (col) => col.notNull().defaultTo(sql<any>`1`))
    .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("deleted_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("payment_types").execute();
}