import { db } from "../database/database";
import { faker } from "@faker-js/faker";

async function seedTaskGoals() {
  const goals = Array.from({ length: 10 }).map(() => ({
    network: faker.company.name(),
    task_offer_id: faker.random.alphaNumeric(10),
    network_task_id: faker.random.alphaNumeric(10),
    network_goal_id: faker.random.alphaNumeric(10),
    network_goal_name: faker.commerce.productName(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: `/uploads/images/${faker.system.fileName()}`,
    cashback: faker.datatype.float({ min: 1, max: 50 }),
    revenue: faker.datatype.float({ min: 1, max: 100 }),
    status: faker.helpers.enumValue({
      publish: "publish",
      paused: "paused",
    }) as any,
    is_translated: faker.datatype.number({ min: 0, max: 1 }),
  }));

  await db.insertInto("offerwall_task_goals").values(goals).execute();

  console.log("Task goals seeded");
}

async function main() {
  try {
    await seedTaskGoals();
  } catch (error) {
    console.error("Failed to seed offerwall networks:", error);
  } finally {
    await db.destroy(); // Ensure to close the database connection properly
  }
}

main();
