import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("offerwall_categories")
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("name", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("icon", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("banner_img", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("is_featured", "boolean", (col) => col.notNull().defaultTo(sql<any>`0`))
    .addColumn("sort_order", "integer", (col) => col.notNull().defaultTo(sql<any>`100`))
    .addColumn("fg_color", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("bg_color", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("mapping_for", sql<any>`varchar(255)`, (col) => col.notNull().defaultTo(sql<any>`'tasks'`))
    .addColumn("match_keywords", sql<any>`varchar(1000)`, (col) => col.notNull())
    .addColumn("match_order", "integer", (col) => col.notNull().defaultTo(sql<any>`100`))
    .addColumn("item_count", "integer", (col) => col.notNull().defaultTo(sql<any>`0`))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("offerwall_categories").execute();
}