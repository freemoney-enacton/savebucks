import { config } from "../config/config";
import { handleAyetTasksImport } from "./functions/ayetImportTask";
import { handleBitlabsTasksImport } from "./functions/bitlabsImportTask";
import checkBonuses from "./functions/checkBonuses";
import { recalculateLeaderboard, startLeaderboard } from "./functions/leaderboardFunctions";
import { handleLootablyTasksImport } from "./functions/lootabltImportTask";
import { handleNotikTasksImport } from "./functions/notikImportTask";
import { handleToroImportTask } from "./functions/offerToroImportTask";
import { cleanupTickersTable } from "./functions/tickerCleanup";


export const cronConfig = [
  {
    name: "Bonus Checks",
    cron: "0 */6 * * *",
    task: checkBonuses,
  },
  {
    name: "Daily Leaderboard Start",
    cron: "0 0 * * *",
    task: () => startLeaderboard('Daily'),
  },
  {
    name: "Weekly Leaderboard Start",
    cron: "0 0 * * 1",
    task: () => startLeaderboard("Weekly"),
  },
  {
    name: "Monthly Leaderboard Start",
    cron: "0 0 1 * *",
    task: () => startLeaderboard('Monthly'),
  },
  {
    name: "Recalculate Leaderboard 4 times a day",
    // cron: "0 0,6,12,18 * * *",
    // cron: "*/5 * * * *",
    cron: "*/1 * * * *",
    task: () => recalculateLeaderboard(),
  },
  {
    name: "cleanup tickers table hourly",
    // cron: "0 0,6,12,18 * * *",
    // cron: "*/5 * * * *",
    cron: "0 * * * *",
    task: () => cleanupTickersTable(),
  },
  {
    name: "Import Ayet",
    cron: "*/5 * * * *",
    task: () => handleAyetTasksImport()
      .then(() => {
        fetch(`${config.env.admin.url}/downloadTaskImage/ayet`)
          .then(() => {
            console.log("ayet tasks imported successfully. from api");
          });
      })
      .catch((error: any) => { // Explicitly typing the error parameter
        console.error("Failed to import ayet tasks:", error);
      }),
  },
  // {
  //   name: "Import Notik",
  //   cron: "*/7 * * * *",
  //     task: () => handleNotikTasksImport()
  //     .then(() => {
  //     fetch(`${config.env.admin.url}/downloadTaskImage/notik`)
  //     .then(() => {
  //     console.log("notik tasks imported successfully.");
  //     });
  //     })
  //     .catch((error: any) => { // Explicitly typing the error parameter
  //     console.error("Failed to import notik tasks:", error);
  //     }),
  // },
  {
    name: "Import torox",
    cron: "*/7 * * * *",
    task: () => handleToroImportTask()
      .then(() => {
        fetch(`${config.env.admin.url}/downloadTaskImage/torox`)
          .then(() => {
            console.log("torox tasks imported successfully. from api");
          });
      })
      .catch((error: any) => { // Explicitly typing the error parameter
        console.error("from api Failed to import torox tasks:", error);
      }),
  },
  {
    name: "Import bitlabs",
    cron: "*/5 * * * *",
    task: () => handleBitlabsTasksImport()
      .then(() => {
        fetch(`${config.env.admin.url}/downloadTaskImage/bitlabs`)
          .then(() => {
            console.log("bitlabs tasks imported successfully.");
          });
      })
      .catch((error: any) => { // Explicitly typing the error parameter
        console.error("Failed to import bitlabs tasks:", error);
      }),
  },
  // {
  //   name: "",
  //   cron: "2 12 * * *",
  //   task: createLeaderboard,
  // },
];
