import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(sql, { schema });

export async function withTransaction<T>(
  callback: (tx: typeof db) => Promise<T>
): Promise<T> {
  return (await sql.begin(async (sqlTransaction) => {
    // console.log("Starting transaction...");
    const txDb = drizzle(sqlTransaction, { schema });
    try {
      // console.log("Executing callback...");
      return await callback(txDb);
    } catch (error) {
      // Ensure the transaction is rolled back
      console.error("Transaction failed:", error);
      throw error;
    }
  })) as Promise<T>;
}
