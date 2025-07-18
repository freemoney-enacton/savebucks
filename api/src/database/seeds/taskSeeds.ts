import { db } from "../database/database"; // Import your configured Kysely database instance
import { faker } from "@faker-js/faker";
async function seedTasks() {
  const tasks = Array.from({ length: 10 }).map(() => ({
    network: faker.company.name(),
    offer_id: faker.random.alphaNumeric(10),
    campaign_id: faker.random.alphaNumeric(10),
    category_id: faker.datatype.number({ min: 1, max: 10 }),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    instructions: faker.lorem.paragraph(),
    image: `/uploads/images/${faker.system.fileName()}`,
    url: faker.internet.url(),
    payout: faker.datatype.float({ min: 1, max: 50 }),
    countries: JSON.stringify(faker.helpers.arrayElements(["US", "IN"])),
    devices: JSON.stringify(faker.helpers.arrayElements(["ios", "android"])),
    platforms: JSON.stringify(faker.helpers.arrayElements(["Mobile", "phone"])),
    conversion_rate: faker.datatype.float({ min: 0, max: 1 }),
    score: faker.datatype.float({ min: 0, max: 1 }),
    daily_cap: faker.datatype.number(),
    created_date: faker.date.past(),
    start_date: new Date(),
    end_date: faker.date.future(),
    offer_type: faker.helpers.enumValue({
      incent: "incent",
      survey: "survey",
    }) as any,
    network_categories: JSON.stringify(faker.random.words()),
    network_goals: JSON.stringify(faker.random.words()),
    redemptions: faker.datatype.number(),
    clicks: faker.datatype.number(),
    status: faker.helpers.enumValue({
      publish: "publish",
      paused: "paused",
    }) as any,
    is_translated: faker.datatype.number({ min: 0, max: 1 }),
    is_featured: faker.datatype.number({ min: 0, max: 1 }),
    goals_count: faker.datatype.number(),
  }));

  await db.insertInto("offerwall_tasks").values(tasks).execute();

  console.log("Tasks seeded");
}

async function main() {
  try {
    await seedTasks();
  } catch (error) {
    console.error("Failed to seed offerwall networks:", error);
  } finally {
    await db.destroy(); // Ensure to close the database connection properly
  }
}

main();
