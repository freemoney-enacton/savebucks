import { faker } from "@faker-js/faker";
import { db } from "../database";

interface User {
  name: string;
  email: string;
  password: string | null;
  referral_code: string;
  referrer_code: string | null;
  googleId: string | null;
  facebookId: string | null;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const generateUser = (): User => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  referral_code: faker.datatype.uuid(),
  referrer_code: faker.datatype.boolean() ? faker.datatype.uuid() : null,
  googleId: faker.datatype.boolean() ? faker.datatype.uuid() : null,
  facebookId: faker.datatype.boolean() ? faker.datatype.uuid() : null,
  is_verified: faker.datatype.boolean(),
  created_at: faker.date.past(2),
  updated_at: new Date(),
});

const generateUsers = (numUsers: number): User[] => {
  return Array.from({ length: numUsers }, generateUser);
};

const users: any = generateUsers(10);
const insertUserSeeds = async () =>
  await db.insertInto("users").values(users).execute();
insertUserSeeds().then(() => console.log("Users seeded"));
