import cron from "node-cron";
import { cronConfig } from "./cronConfig";

cronConfig.forEach((cc) => {
  cron.schedule(cc.cron, cc.task, {
    timezone: "UTC",
  });
});
