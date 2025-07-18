import { test } from "tap";
import { createApp } from "../app";

test("POST /api/v1/auth/register", async (t) => {
  const app = await createApp();
  const res = await app.inject({
    method: "POST",
    url: "/api/v1/auth/register",
    body: {
      name: "test12",
      email: "test123456@test.com",
      password: "Test123456@#",
    },
  });
  t.equal(res.statusCode, 200);
  t.equal(res.json().success, true);
  t.equal(res.json().message, "Registered successfully!");
  t.end();
});
