import { db } from "../../database/database";

export async function cleanupTickersTable() {
  try {
    // Get total count of records
    const totalRecordsResult = await db
      .selectFrom('tickers')
      .select(db.fn.count<number>('id').as('count'))
      .executeTakeFirst();

    const totalRecords = Number(totalRecordsResult?.count || 0);

    // If we have 50 or fewer records, no cleanup needed
    if (totalRecords <= 50) {
      console.log('No cleanup needed. Total records:', totalRecords);
      return 0;
    }

    // Get IDs of the 50 most recent records
    const recentRecords = await db
      .selectFrom('tickers')
      .select('id')
      .orderBy("created_at", 'desc')
      .limit(50)
      .execute();

    const recentIds = recentRecords.map(record => record.id);

    // Delete all records NOT in the list of recent 50 IDs
    const result = await db
      .deleteFrom('tickers')
      .where('id', 'not in', recentIds)
      .execute();

    const deletedCount = Number(result[0].numDeletedRows || 0);
    console.log(`Deleted ${deletedCount} old records from tickers table`);
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up tickers table:', error);
    throw error;
  }
}