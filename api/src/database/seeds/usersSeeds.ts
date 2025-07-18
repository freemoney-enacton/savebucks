import { db } from "../database"; // Assuming you've set up your Kysely connection as shown before
import bcrypt from "bcrypt";

const users: any = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123", // You should hash this
    googleId: null,
    facebookId: null,
    is_verified: true,
  },
  // Add more user objects here
];

async function seedUsers() {
  for (const user of users) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10); // Hash the password
    }
  }

  await db.insertInto("users").values(users).execute();
  console.log("Users table seeded successfully.");
}

seedUsers().catch((error) => {
  console.error("Failed to seed users:", error);
  process.exit(1);
});
