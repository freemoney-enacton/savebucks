import { test } from "tap";
import { createApp } from "../app";

// test("GET /api/v1/categories", async (t) => {
//   const app = await createApp();
//   const res = await app.inject({
//     method: "GET",
//     url: "/api/v1/categories/",
//   });
//   t.equal(res.statusCode, 200);
//   t.equal(res.json().success, true);
//   t.end();
// });
test("GET /health", async (t) => {
  const app = await createApp();
  const res = await app.inject({
    method: "GET",
    url: "/health",
  });
  t.equal(res.json().statusCode, 200);
  t.equal(res.json().status, "ok");
  t.end();
});
