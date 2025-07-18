import axios from "axios";
import { db } from "../../database/database";

export async function getNetworkDetails(networkCode: any) {
  const result = await db
    .selectFrom("offerwall_networks")
    .selectAll()
    .where("code", "=", networkCode)
    .where("type", "=", "tasks")
    .where("enabled","=",1)
    .executeTakeFirst();

  if (!result) {
    throw new Error("Offerwall Task Network Not Found");
  }
  return result;
}
export async function UpsertData(data: any) {
  // ['category_id','image', 'payout', 'url', 'countries', 'devices', 'platforms', 'conversion_rate', 'network_goals','network_categories','goals_count']
  data.map(async (task: any) => {
    const taskToInsert = { ...task };

    if (task.status !== "trash") {
      taskToInsert.status = "publish"; // Set status to "publish" if not "trash"
    }
    const result = await db
      .insertInto("offerwall_tasks")
      .values(task)
      .onDuplicateKeyUpdate({
        ...taskToInsert,
        updated_at: new Date(),
      })
      .execute();
  });
}

export async function RemoveTaskAndGoals(network: string, import_id: string) {
  console.log("🚀 ~ RemoveTaskAndGoals from api ~ network:", network)
  console.log("🚀 ~ RemoveTaskAndGoals from api~ import_id:", import_id)
  // Bulk update for tasks where the network matches and import_id doesn't match the given import_id
  const taskUpdateResult = await db
    .updateTable("offerwall_tasks")
    .set({ status: "removed" })
    .where("network", "=", network)
    .where("import_id", "<>", import_id.trim())  // "<>" means not equal to
    .execute();

  // Bulk update for goals where the network matches and import_id doesn't match the given import_id
  const goalUpdateResult = await db
    .updateTable("offerwall_task_goals")
    .set({ status: "trash" })
    .where("network", "=", network)
    .where("import_id", "<>", import_id.trim())  // "<>" means not equal to
    .execute();

  console.log("Removed Done");
}


export async function UpsertGoalsData(data: any) {
  data.map(async (goal: any) => {
    goal.status ="publish"
    const result = await db
      .insertInto("offerwall_task_goals")
      .values(goal)
      .onDuplicateKeyUpdate({
        ...goal,
        updated_at: new Date(),
      })
      .execute();
  });
}

export function cleanCountries(countries: any) {
  if (countries.includes("*")) {
    return null;
  }
  return countries.map((country: any) => country.toUpperCase());
}

export function cleanDevices(devices: any) {
  if (devices.includes("*")) {
    return null;
  }
  return devices.map((device: any) => device.name.toLowerCase());
}
function getPlatform(offer: any) {
  return offer.device_targeting.operating_systems.map((os: any) =>
    os.name === "android" ? "android" : os.name === "ios" ? "ios" : "web"
  );
}
export function getPlatformFromDevice(devices: any) {
  const config: any = {
    macos: "ios",
    ipad: "ios",
    iphone: "ios",
    ios: "ios",
    iphone_ipad: "ios",
    android: "android",
    desktop: "web",
    mobile: "android",
  };
  const platforms = devices
    .filter((device: any) => config[device])
    .map((device: any) => config[device]);
  if (platforms.length == 0) {
    return ["android", "ios", "web"];
  }
  return [...new Set(platforms)]; // Return unique platforms
}

// Fetches categories from the database and organizes them into relevant categories and 'other' category
async function fetchCategories() {
  const categories = await db
    .selectFrom("offerwall_categories")
    .select(["id", "match_keywords"])
    .where("is_enabled","=",1)
    .orderBy("match_order", "asc")
    .execute();

  const relevantCategories = categories.filter(
    (cat) => cat.match_keywords !== "other"
  );
  const otherCategory = categories.find(
    (cat) => cat.match_keywords === "other"
  ) || { id: null }; // default to -1 if not found

  return { relevantCategories, otherCategoryId: otherCategory?.id };
}

function getCategoryDeterminingFields(task: any): string[] {
  const fieldsToCheck = [
    task.name ?? "",
    task.description ?? "",
    task.instructions ?? "",
    task.network_categories ?? "",
  ];
  
  // Parse JSON strings if they exist
  const nameObj = tryParseJson(task.name);
  const descriptionObj = tryParseJson(task.description);
  const instructionsObj = tryParseJson(task.instructions);
  const networkCategoriesObj = tryParseJson(task.network_categories);
  
  // Add parsed content
  if (nameObj && nameObj.en) fieldsToCheck.push(nameObj.en);
  if (descriptionObj && descriptionObj.en) fieldsToCheck.push(descriptionObj.en);
  
  // Add all instructions values
  if (instructionsObj) {
    Object.values(instructionsObj).forEach(value => {
      if (typeof value === 'string') fieldsToCheck.push(value);
    });
  }
  
  // Handle network categories - support both array and string formats
  if (networkCategoriesObj) {
    if (Array.isArray(networkCategoriesObj)) {
      // Handle array of categories (Ayet format)
      networkCategoriesObj.forEach(category => {
        if (typeof category === 'string') fieldsToCheck.push(category);
      });
    } else if (typeof networkCategoriesObj === 'string') {
      // Handle single category string (Torox format)
      fieldsToCheck.push(networkCategoriesObj);
    }
  }
  
  // Filter out empty strings and nulls
  return fieldsToCheck.filter(field => field !== null && field !== "");
}

// Helper function to safely parse JSON
function tryParseJson(jsonString: string | null): any {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

// Determines the category based on keywords matched in the combined text of the task fields
async function determineCategory(sentences: string[]): Promise<any> {
  const { relevantCategories, otherCategoryId } = await fetchCategories();
  const combinedText = sentences.join(" ");

  for (const category of relevantCategories) {
    const pattern = new RegExp(
      `\\b(${category.match_keywords.replace(/\|/g, "|")})\\b`,
      "i"
    );
    if (pattern.test(combinedText)) {
      return category.id;
    }
  }

  return otherCategoryId;
}

// Determines and assigns the category to a task based on its text fields
export async function determineAndAssignCategoryToTask(
  task: any
): Promise<any> {
  const fieldsToDetermineCategory = getCategoryDeterminingFields(task);
  task.category_id = await determineCategory(fieldsToDetermineCategory);
  return task.category_id;
}
export async function handleTasksImport(
  apiUrl: any,
  headers: any,
  queryParams: any
) {
  if (!apiUrl) {
    throw new Error("API URL must be provided");
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: headers || {},
      params: queryParams || {},
    });

    if (response.status !== 200) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return transformResponse(response.data);
  } catch (error: any) {
    console.error("Error handling task import:", error.message);
    throw error;
  }
}

export function transformResponse(data: any) {
  // Transform data as needed
  return data;
}

export function sluggify(networkCode: any,text: any, id: any) {
  const baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')      // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

  // Combine network code + base slug + id
  return `${networkCode.toString().toLowerCase()}-${baseSlug}-${id.toString()}`;
}