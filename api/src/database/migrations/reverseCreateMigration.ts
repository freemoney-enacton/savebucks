import { sql } from "kysely";
import fs from "fs";
import path from "path";
import { db } from "../database";

async function generateMigrationCode(schemaName: string, database: string) {
  if (database === "mysql") {
    const tableData = await sql<any>`SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = ${schemaName};`.execute(db);

    tableData.rows.forEach(async (tableName: any) => {
      const schemaResult = await sql<any>`
        SELECT COLUMN_NAME,COLUMN_TYPE, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY, EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = ${tableName.table_name} AND TABLE_SCHEMA = ${schemaName}
    `.execute(db);
      const constraintsData = await sql<any>`SELECT 
  kcu.CONSTRAINT_NAME,
  kcu.COLUMN_NAME,
  kcu.REFERENCED_TABLE_NAME,
  kcu.REFERENCED_COLUMN_NAME,
  rc.UPDATE_RULE,
  rc.DELETE_RULE
FROM 
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
JOIN 
  INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS rc
ON 
  kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
WHERE 
  kcu.TABLE_NAME = 'offerwall_tasks' 
  AND kcu.TABLE_SCHEMA = 'laraback10_enactweb'
  AND kcu.REFERENCED_TABLE_NAME IS NOT NULL;`.execute(db);
      const schema = schemaResult.rows;
      let migrationUpCode = `import { Kysely, sql } from "kysely";\n\nexport async function up(db: Kysely<any>): Promise<void> {\n  await db.schema.createTable("${tableName.table_name}")\n`;
      let migrationDownCode = `export async function down(db: Kysely<any>): Promise<void> {\n  await db.schema.dropTable("${tableName.table_name}")`;

      schema.forEach((column) => {
        const {
          COLUMN_NAME,
          DATA_TYPE,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          COLUMN_KEY,
          EXTRA,
        } = column;

        let constraints = [];

        // Primary Key
        if (COLUMN_KEY === "PRI") constraints.push("primaryKey()");
        // Auto Increment
        if (EXTRA === "auto_increment") constraints.push("autoIncrement()");
        // Not Null
        if (IS_NULLABLE === "NO") constraints.push("notNull()");
        // Unique
        if (COLUMN_KEY === "UNI") constraints.push("unique()");
        // Default Value
        if (COLUMN_DEFAULT) {
          if (DATA_TYPE === "timestamp") {
            constraints.push(`defaultTo(sql<any>\`CURRENT_TIMESTAMP\`)`);
            console.log("CONSTRAINTS:", constraints);
          } else {
            constraints.push(`defaultTo(sql<any>\`${COLUMN_DEFAULT}\`)`);
          }
        }

        if (DATA_TYPE == "varchar") {
          if (constraints.length > 0) {
            migrationUpCode += `    .addColumn("${COLUMN_NAME}", sql<any>\`${COLUMN_TYPE}\`, ${
              constraints.length > 0
                ? `(col) => col.${constraints.join(".")}`
                : "null"
            })\n`;
          } else {
            migrationUpCode += `    .addColumn("${COLUMN_NAME}", sql<any>\`${COLUMN_TYPE}\`)\n`;
          }
        }

        if (DATA_TYPE === "enum") {
          console.log(COLUMN_TYPE);
          if (constraints.length > 0) {
            migrationUpCode += `.addColumn("${COLUMN_NAME}", sql<any>\`${COLUMN_TYPE}\`, ${
              constraints.length > 0
                ? `(col) => col.${constraints.join(".")}`
                : "null"
            })\n`;
          } else {
            migrationUpCode += `    .addColumn("${COLUMN_NAME}", "${COLUMN_TYPE}")\n`;
          }
        }
        if (DATA_TYPE === "longtext") {
          if (constraints.length > 0) {
            migrationUpCode += `    .addColumn("${COLUMN_NAME}", sql<any>\`${DATA_TYPE}\`, ${
              constraints.length > 0
                ? `(col) => col.${constraints.join(".")}`
                : "null"
            })\n`;
          } else {
            migrationUpCode += `    .addColumn("${COLUMN_NAME}", sql<any>\`${DATA_TYPE}\`)\n`;
          }
        }

        if (
          DATA_TYPE !== "enum" &&
          DATA_TYPE !== "longtext" &&
          DATA_TYPE !== "varchar"
        ) {
          // Mapping SQL data types to Kysely data types
          let kyselyType = mapSqlTypeToKysely(DATA_TYPE);
          if (constraints.length > 0) {
            migrationUpCode += `    .addColumn("${COLUMN_NAME}", "${kyselyType}", (col) => col.${constraints.join(
              "."
            )})\n`;
          } else {
            migrationUpCode += `    .addColumn("${COLUMN_NAME}", "${kyselyType}")\n`;
          }
        }
        constraintsData.rows.forEach((constraint) => {
          if (COLUMN_NAME == constraint.COLUMN_NAME) {
            migrationUpCode += `.addForeignKeyConstraint("${constraint.CONSTRAINT_NAME}", ["${constraint.COLUMN_NAME}"], "${constraint.REFERENCED_TABLE_NAME}", ["${constraint.REFERENCED_COLUMN_NAME}"]`;
            if (constraint.UPDATE_RULE) {
              migrationUpCode += `,(cb: any) =>
            cb.onUpdate('${constraint.UPDATE_RULE.toLowerCase()}')`;
              if (constraint.DELETE_RULE) {
                migrationUpCode += `.onDelete('${constraint.DELETE_RULE.toLowerCase()}')`;
              }
            }
            migrationUpCode += ")\n";
          }
        });
      });

      migrationUpCode += "    .execute();\n}\n\n";
      migrationDownCode += ".execute();\n}";

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
      // Optionally, write the generated code to files
      const migrationFilePath = path.join(
        __dirname,
        `./reverseMigration/${timestamp}_${tableName.table_name}_migration.ts`
      );
      fs.writeFileSync(
        migrationFilePath,
        `${migrationUpCode}${migrationDownCode}`
      );
      console.log(`Migration file generated at: ${migrationFilePath}`);
    });
  }

  //postgres
  else if (database == "postgres") {
    const tableData = await sql<any>`SELECT
    *
    FROM
      information_schema."tables"`.execute(db);
    tableData.rows.forEach(async (tableName) => {
      const schemaResult = await sql<any>`
    SELECT
     *
    FROM
      information_schema.columns
    WHERE
      table_name = ${tableName.table_name}
      AND table_schema = ${tableName.table_schema}
  `.execute(db);
      // Query for table foreign key constraints in PostgreSQL
      const constraintsData = await sql<any>`
    SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name

  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_catalog = kcu.constraint_catalog
      AND tc.constraint_schema = kcu.constraint_schema
      AND tc.constraint_name = kcu.constraint_name
    LEFT JOIN pg_index AS idx ON tc.constraint_name = idx.indexrelid::regclass::text
  WHERE
    tc.table_name = ${tableName.table_name} -- Replace 'your_table_name' with your actual table name
    AND tc.table_schema = ${tableName.table_schema} -- Replace 'your_schema_name' with your actual schema name, e.g., 'public'
  ORDER BY
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    kcu.ordinal_position;
  `.execute(db);
      const schema = schemaResult.rows;
      let migrationUpCode = `import { Kysely, sql } from "kysely";\n\nexport async function up(db: Kysely<any>): Promise<void> {\n  await db.schema.createTable("${tableName.table_name}")\n`;
      let migrationDownCode = `export async function down(db: Kysely<any>): Promise<void> {\n  await db.schema.dropTable("${tableName.table_name}")`;
      schema.forEach((column: any) => {
        const {
          column_name,
          column_default,
          data_type,
          is_nullable,
          udt_name,
          column_key,
          extra,
          is_generated,
        } = column;

        let constraints = [];
        constraintsData.rows.forEach((constraint: any) => {
          const { constraint_type } = constraint;
          const colName = constraint.column_name;
          if (colName == column_name) {
            //Indexes
            if (constraint_type === "PRIMARY KEY") {
              constraints.push("primaryKey()");
            }
            if (constraint_type === "UNIQUE") {
              constraints.push("unique()");
            }
          }
        });
        // // Auto Increment
        if (is_generated !== "NEVER") constraints.push("autoIncrement()");
        // // Not Null
        if (is_nullable === "NO") constraints.push("notNull()");
        // // Unique
        // if (COLUMN_KcolEY === "UNI") constraints.push("unique()");
        // Default Value
        if (column_default && column_default !== "NULL") {
          if (column_default === "timestamp") {
            constraints.push(`defaultTo(sql<any>\`CURRENT_TIMESTAMP\`)`);
          } else {
            constraints.push(`defaultTo(sql<any>\`${column_default}\`)`);
          }
        }

        if (udt_name == "varchar") {
          if (constraints.length > 0) {
            migrationUpCode += `    .addColumn("${column_name}", sql<any>\`${udt_name}\`, ${
              constraints.length > 0
                ? `(col) => col.${constraints.join(".")}`
                : "null"
            })\n`;
          } else {
            migrationUpCode += `    .addColumn("${column_name}", sql<any>\`${udt_name}\`)\n`;
          }
        }

        if (udt_name === "enum") {
          if (constraints.length > 0) {
            migrationUpCode += `.addColumn("${column_name}", sql<any>\`${udt_name}\`, ${
              constraints.length > 0
                ? `(col) => col.${constraints.join(".")}`
                : "null"
            })\n`;
          } else {
            migrationUpCode += `    .addColumn("${column_name}", "${udt_name}")\n`;
          }
        }
        if (udt_name === "JSON") {
          if (constraints.length > 0) {
            migrationUpCode += `    .addColumn("${column_name}", sql<any>\`${udt_name}\`, ${
              constraints.length > 0
                ? `(col) => col.${constraints.join(".")}`
                : "null"
            })\n`;
          } else {
            migrationUpCode += `    .addColumn("${column_name}", sql<any>\`${udt_name}\`)\n`;
          }
        }

        if (
          udt_name !== "enum" &&
          udt_name !== "jsonb" &&
          udt_name !== "varchar"
        ) {
          // Mapping SQL data types to Kysely data types
          let kyselyType = mapPgSqlTypeToKysely(udt_name);
          if (constraints.length > 0) {
            migrationUpCode += `    .addColumn("${column_name}", "${kyselyType}", (col) => col.${constraints.join(
              "."
            )})\n`;
          } else {
            migrationUpCode += `    .addColumn("${column_name}", "${kyselyType}")\n`;
          }
        }
        constraintsData.rows.forEach((constraint: any) => {
          if (column_name == constraint.COLUMN_NAME) {
            migrationUpCode += `.addForeignKeyConstraint("${constraint.CONSTRAINT_NAME}", ["${constraint.COLUMN_NAME}"], "${constraint.REFERENCED_TABLE_NAME}", ["${constraint.REFERENCED_COLUMN_NAME}"]`;
            if (constraint.UPDATE_RULE) {
              migrationUpCode += `,(cb: any) =>
        cb.onUpdate('${constraint.UPDATE_RULE.toLowerCase()}')`;
              if (constraint.DELETE_RULE) {
                migrationUpCode += `.onDelete('${constraint.DELETE_RULE.toLowerCase()}')`;
              }
            }
            migrationUpCode += ")\n";
          }
        });
      });

      migrationUpCode += "    .execute();\n}\n\n";
      migrationDownCode += ".execute();\n}";

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
      // Optionally, write the generated code to files
      const migrationFilePath = path.join(
        __dirname,
        `./migration`,
        `${timestamp}_${tableName.table_name}_migration.ts`
      );
      fs.writeFileSync(
        migrationFilePath,
        `${migrationUpCode}${migrationDownCode}`
      );
      console.log(`Migration file generated at: ${migrationFilePath}`);
    });
  }
}

function mapPgSqlTypeToKysely(sqlType: string): string {
  switch (sqlType) {
    case "uuid":
      return "uuid";
    case "bigint":
      return "bigint";
    case "integer":
    case "int":
    case "int4": // PostgreSQL integer
      return "integer";
    case "int2": // PostgreSQL smallint
      return "int2";
    case "boolean":
    case "bool": // PostgreSQL boolean
      return "boolean";
    case "timestamp":
    case "timestamp without time zone":
      return "timestamp";
    case "timestamptz":
    case "timestamp with time zone":
      return "timestamptz";
    case "date":
      return "date";
    case "time":
    case "time without time zone":
      return "time";
    case "timetz":
    case "time with time zone":
      return "timeTz";
    case "numeric":
    case "decimal":
      return "decimal";
    case "real":
    case "float4": // PostgreSQL real
      return "real";
    case "double precision":
    case "float8": // PostgreSQL double precision
      return "double";
    case "char":
    case "character":
    case "bpchar": // PostgreSQL char (fixed length)
      return "char";
    case "varchar":
    case "character varying":
      return "varchar";
    case "text":
      return "text";
    case "uuid":
      return "uuid";
    case "json":
      return "json";
    case "jsonb":
      return "jsonb";
    case "bytea":
      return "binary";
    case "array":
      return "array"; // You might need a more specific handling for array types
    // Add more PostgreSQL types as needed
    default:
      return "text"; // Default fallback, adjust as needed
  }
}
function mapSqlTypeToKysely(sqlType: any): string {
  switch (sqlType) {
    case "bigint":
      return "bigint";
    case "int":
      return "integer";
    case "tinyint":
      return "boolean"; // Assuming tinyint(1) is used for boolean
    case "boolean":
      return "boolean";
    case "timestamp":
      return "timestamp";
    default:
      return "text"; // Default fallback, adjust as needed
  }
}

// Call the function with your table name
generateMigrationCode(process.argv[2], process.argv[3]);
