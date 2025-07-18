import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("offerwall_postback_logs")
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement().notNull())
    .addColumn("network", "text", (col) => col.notNull())
    .addColumn("transaction_id", "text", (col) => col.defaultTo(sql<any>`NULL`))
    .addColumn("payload", "text", (col) => col.notNull())
    .addColumn("data", "text", (col) => col.notNull())
.addColumn("status", sql<any>`enum('pending','processed','error')`, (col) => col.notNull().defaultTo(sql<any>`'pending'`))
    .addColumn("message", sql<any>`varchar(255)`, (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql<any>`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("offerwall_postback_logs").execute();
}