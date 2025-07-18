import { db } from "../database";
import { faker } from "@faker-js/faker";

async function seedOfferwallCategories() {
  const categories = Array.from({ length: 1 }).map(() => ({
    name: faker.commerce.department(),
    icon: `/uploads/images/categories/${faker.system.fileName()}.png`,
    banner_img: `/uploads/images/categories/${faker.system.fileName()}.png`,
    is_featured: faker.datatype.number({ min: 0, max: 1 }),
    sort_order: faker.datatype.number(),
    fg_color: faker.internet.color(),
    bg_color: faker.internet.color(),
    mapping_for: faker.helpers.arrayElement(["tasks", "surveys"]),
    match_keywords: faker.random.words(3).toString(),
    match_order: faker.datatype.number(),
    item_count: faker.datatype.number(),
  }));

  await db.insertInto("offerwall_categories").values(categories).execute();

  console.log("Offerwall categories seeded successfully.");
}

async function main() {
  try {
    await seedOfferwallCategories();
    console.log("object");
  } catch (error) {
    console.error("Failed to seed offerwall categories:", error);
  } finally {
    await db.destroy();
  }
}

main();
