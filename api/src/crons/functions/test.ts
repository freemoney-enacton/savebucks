import { db } from "../../database/database";

export async function updateCurrencies() {
    let updatedRowCount = 0;
  try {
    // Step 1: Fetch all relevant rows
    const rows = await db
      .selectFrom('giftcard_brands')
      .select(['id', 'items'])
      .execute();

    for (const row of rows) {
      const { id, items } = row;

      try {
        // Step 2: Parse items if it's a string
        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

        // Step 3: Get currencyCode from the first item
        const currencyCode = Array.isArray(parsedItems)
          ? parsedItems[0]?.currencyCode
          : undefined;

        if (currencyCode) {
          // Step 4: Update the currency column
          await db
            .updateTable('giftcard_brands')
            .set({ currency: currencyCode })
            .where('id', '=', id)
            .executeTakeFirst();

            updatedRowCount++;
          console.log(`✅ Updated ID ${id} with currency: ${currencyCode}`);
        } else {
          console.log(`❌ No currencyCode found for ID ${id}`);
        }
      } catch (parseError: any) {
        console.error(`⚠️ Failed to parse JSON for ID ${id}:`, parseError.message);
      }
    }

    console.log(`✅ Currency update completed. Total rows updated: ${updatedRowCount}`);
    console.log('✅ Currency update completed.');
  } catch (err: any) {
    console.error('❌ Database error:', err.message);
  }
}