import fs from "fs";
import path from "path";
import { db } from "../database";
import { TableExpression } from "kysely";
import { DB } from "../db";

// Function to chunk an array into smaller arrays
function chunkArray(array: any[], chunkSize: number): any[][] {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function generateSeeders(tableName: TableExpression<DB, keyof DB>) {
  const rows = await db.selectFrom(tableName).selectAll().execute();

  // Define chunk size
  const chunkSize = 100; // Adjust based on your needs
  const chunks = chunkArray(rows, chunkSize);

  // Generating timestamp for file naming
  const timestamp = Date.now();

  // Seeder file path
  const seederFilePath = path.join(
    __dirname,
    "seeders",
    `${tableName}_seeds_${timestamp}.ts`
  );

  // Generating seeder content for each chunk
  const seederContent = chunks
    .map((chunk, index) => {
      return `// Chunk ${index + 1}
    for (const item of ${JSON.stringify(chunk)}) {
      await db.insertInto('${tableName}').values(item).execute();
    }\n`;
    })
    .join("\n");

  // Seeder file template
  const seederFileTemplate = `
import { Kysely, SqliteDialect } from 'kysely';
import { db } from "../../database";
async function seed(db: Kysely<any>) {
  ${seederContent}
}

seed(db).then(() => {
  console.log("Done!");
});
  `;

  // Write the seeder file
  await fs.writeFileSync(
    `src/database/reverseSeeds/seeders/${tableName}_seeds_${timestamp}.ts`,
    seederFileTemplate,
    "utf8"
  );
  console.log("Seeder file generated successfully:", seederFilePath);
}

// Extracting table name from command line arguments
const tableName: any = process.argv[2];
if (!tableName) {
  console.error("Please provide a table name.");
  process.exit(1);
}

generateSeeders(tableName).catch((err) => console.error(err));
