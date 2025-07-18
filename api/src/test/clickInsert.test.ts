import { test } from "tap";
import { createApp } from "../app";

test("GET /api/v1/task/click/insert", async (t) => {
  const app = await createApp();

  // Create a valid access token
  const token = "valid_access_token";

  const res = await app.inject({
    method: "GET",
    url: "/api/v1/click/insert",
    headers: {
      Authorization: token,
    },
    query: {
      platform: "web",
      network: "adnetwork",
      task_type: "click",
      campaign_id: "1234",
    },
  });

  t.equal(res.statusCode, 201);
  t.equal(res.json().success, 1);
  t.equal(res.json().message, "Inserted Successfully");
  t.end();
});
