import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("banners")
    .addColumn("id", "integer", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("title", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("description", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("link", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("desktop_img", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("mobile_img", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("have_content", "boolean", (col) => col.defaultTo(sql<any>`0`))
    .addColumn("btn_link", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("btn_text", sql<any>`varchar(255)`, (col) => col.notNull())
.addColumn("status", sql<any>`enum('publish','trash','draft','')`, (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("banners").execute();
}