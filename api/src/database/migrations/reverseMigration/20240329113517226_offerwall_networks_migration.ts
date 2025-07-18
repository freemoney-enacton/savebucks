import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("offerwall_networks")
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("name", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("code", "text", (col) => col.notNull())
    .addColumn("logo", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
.addColumn("type", sql<any>`enum('tasks','surveys')`, (col) => col.notNull())
    .addColumn("config_params", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("postback_validation_key", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("postback_key", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("api_key", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("app_id", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("pub_id", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("countries", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("categories", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("enabled", "boolean", (col) => col.defaultTo(sql<any>`1`))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("offerwall_networks").execute();
}