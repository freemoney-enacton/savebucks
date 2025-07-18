import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("offerwall_tasks")
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("network", "text", (col) => col.notNull())
    .addColumn("offer_id", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("campaign_id", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("category_id", "bigint", (col) => col.notNull())
.addForeignKeyConstraint("offerwall_tasks_category_id_foreign", ["category_id"], "offerwall_categories", ["id"],(cb: any) =>
            cb.onUpdate('restrict').onDelete('cascade'))
    .addColumn("name", sql<any>`longtext`, (col) => col.notNull())
    .addColumn("description", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("instructions", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("image", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("url", sql<any>`varchar(2500)`, (col) => col.notNull())
    .addColumn("payout", "text", (col) => col.notNull().defaultTo(sql<any>`0.00`))
    .addColumn("countries", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("devices", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("platforms", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("conversion_rate", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("score", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("daily_cap", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("created_date", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("start_date", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("end_date", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("offer_type", sql<any>`varchar(255)`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("network_categories", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("network_goals", sql<any>`longtext`, (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("redemptions", "integer", (col) => col.notNull().defaultTo(sql<any>`0`))
    .addColumn("clicks", "integer", (col) => col.notNull().defaultTo(sql<any>`0`))
.addColumn("status", sql<any>`enum('publish','draft','trash')`, (col) => col.defaultTo(sql<any>`'publish'`))
    .addColumn("is_translated", "boolean", (col) => col.notNull().defaultTo(sql<any>`0`))
    .addColumn("is_featured", "boolean", (col) => col.notNull().defaultTo(sql<any>`0`))
    .addColumn("goals_count", "integer", (col) => col.notNull().defaultTo(sql<any>`1`))
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("offerwall_tasks").execute();
}