import { db } from "../database"; // Import your configured Kysely database instance
import { faker } from "@faker-js/faker";

enum Type {
  tasks,
  surveys,
}

async function seedOfferwallNetworks() {
  const networks = Array.from({ length: 10 }).map(() => ({
    // Generate 10 networks
    name: faker.company.name(),
    code: faker.random.alphaNumeric(8).toUpperCase(),
    logo: `/uploads/images/ow_networks/${faker.system.fileName()}.png`,
    type: faker.helpers.enumValue({
      task: "tasks",
      surverys: "surveys",
    }) as any,
    config_params: JSON.stringify({
      param1: faker.lorem.word(),
      param2: faker.lorem.word(),
    }),
    postback_validation_key: faker.random.alphaNumeric(16),
    postback_key: faker.random.alphaNumeric(16),
    api_key: faker.random.alphaNumeric(32),
    app_id: faker.random.alphaNumeric(32),
    pub_id: faker.random.alphaNumeric(32),
    countries: faker.random.alphaNumeric(32),
    categories: faker.commerce.department() + "," + faker.commerce.department(),
    enabled: faker.datatype.number({ min: 0, max: 1 }),
  }));

  for (const network of networks) {
    await db.insertInto("offerwall_networks").values(network).execute();
  }

  console.log("Offerwall networks seeded successfully.");
}

async function main() {
  try {
    await seedOfferwallNetworks();
  } catch (error) {
    console.error("Failed to seed offerwall networks:", error);
  } finally {
    await db.destroy(); // Ensure to close the database connection properly
  }
}

main();
