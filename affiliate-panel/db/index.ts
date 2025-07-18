import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  connectionLimit: 20,
});
export const db = drizzle(pool, { schema, mode: "default" });

export async function withTransaction<T>(
  callback: (tx: typeof db) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const txDb = drizzle(connection, {
      schema,
      mode: "default",
    }) as unknown as typeof db;
    const result = await callback(txDb);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction failed:", error);
    throw error;
  } finally {
    connection.release();
  }
}
