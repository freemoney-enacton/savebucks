import { FastifyReply, FastifyRequest } from "fastify";
import * as task from "./task.model";
import { FetchTaskQuery, taskCategorySchema, tasksSchema } from "./task.schemas";
import app from "../../app";
import { getSetCachedData } from "../../utils/getCached";
import { db } from "../../database/database";
import { findUser } from "../user/user.model";
import { config } from "../../config/config";
import { moveUploadedFile } from "../../utils/ImageUpload";
import path from "path";
import fs from "fs";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import * as postback from "../postback/postback.model";
import crypto from "crypto";
import * as providers from "../providers/offerProviders.model";
import { replaceMacros } from "../../utils/replaceMacros";


const imagePrefix = `${config.env.app.image_url}`;

export const list = async (req: FastifyRequest, reply: FastifyReply) => {
  const country_code = req.headers["x-country"] ?? req.headers["cf-ipcountry"] ?? "XX";
  const lang = req.headers["x-language"] ?? "en";
  const {
    name,
    countries,
    page,
    limit,
    platform,
    featured,
    network,
    category,
    sort_by,
    recommended,
  } = req.query as FetchTaskQuery;
  const categoryId = await task.findCategoryId(category || "");
  const ArrPlat: string[] | null = platform ? platform.split(",") : null;
  const ArrCountry: string[] | null = countries
    ? countries.split(",")
    : JSON.parse(`["${country_code}"]`);
  const result = await task.list(
    name != undefined ? `%${name}%` : null,
    sort_by || null,
    typeof ArrCountry != undefined || ArrCountry ? ArrCountry : null,
    Number(page) || null,
    limit != null ? parseInt(limit.toString()) : limit,
    typeof ArrPlat != undefined || ArrPlat ? ArrPlat : null,
    featured != null || featured != undefined ? Number(featured) : null,
    recommended != null || recommended != undefined
      ? Number(recommended)
      : null,
    network || null,
    categoryId != null || categoryId != undefined ? categoryId.id : null,
    lang?.toString()
  );
  const lastPage = limit
    ? Number(result?.count) / Number(limit)
    : Number(result?.count) / 20;
  if (result != null) {
    const tasks = result.transformedData.map((task: any) => ({
      id: task.task_id,
      name: task.Name,
      description: task.description,
      // instructions: task.instructions,
      network: task.network,
      task_id: task.campaign_id,
      offer_id: task.offer_id,
      category_id: task.category_id,
      image: (task.image?.includes('http') || !task.image) ? task.image : `${imagePrefix}/${task.image}`,
      url: task.url,
      payout: task.payout,
      payout_type: task.payout_type,
      countries: task.countries ? JSON.parse(task.countries) : null,
      platforms: task.platforms ? JSON.parse(task.platforms) : null,
      // status: task.status,
      tier: task.tier,
      is_featured: task.is_featured,
      banner_image: task.banner_image ? `${imagePrefix}/${task.banner_image}` : null,
      tracking_speed: task.tracking_speed,
      slug: task.slug,
      open_external_browser: task.open_task_external_browser ? task.open_task_external_browser : task.app_open_external_browser,
      // goals_count: task.goals_count,
      // goals: task.network_goals ? JSON.parse(task.network_goals) : null,
      provider: {
        code: task.code,
        name: task.network,
        icon: (task.network_icon?.includes('http') || !task.network_icon) ? task.network_icon : `${imagePrefix}/${task.network_icon}`,
        logo: (task.network_logo?.includes('http') || !task.network_logo) ? task.network_logo : `${imagePrefix}/${task.network_logo}`,
        render_type: task.render_type,
      },
      category: {
        name: task.name,
        id: task.category_id,
        icon: (task.category_icon?.includes('http') || !task.category_icon) ? task.category_icon : `${imagePrefix}/${task.category_icon}`,
        bg_color: task.bg_color,
        sort_order: task.sort_order,
      },
    }));
    return reply.sendSuccess(
      tasks,
      200,
      "null",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendSuccess(null, 200, "Task Not found", 0, 0);
  }
};

export const details = async (req: FastifyRequest, reply: FastifyReply) => {
  const currency: any = await getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  const { network, task_id } = req.params as {
    network: string;
    task_id: string;
  };
  const lang = req.headers["x-language"];
  const result = await task.details(
    network,
    task_id,
    Number(req.userId),
    lang?.toString() || "en"
  );

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.val,
  });

  const parts: any = formatter.formatToParts(0);
  const currencySymbol = parts.find(
    (part: any) => part.type === "currency"
  ).value;
  const userDetails = await findUser(Number(req.userId));
  if (!result) {
    return reply.sendError(app.polyglot.t("error.task.detailsNotFound"), 404);
  }
  const screenshotDetails = await task.fetchUserUpload(Number(req.userId), network, task_id)

  const networkGoalsWithStatus = await task.getUserTaskGoalsStatus(result.network, result.campaign_id, Number(req.userId), lang?.toString() || "en");

  return reply.sendSuccess(
    {
      id: result.task_id,
      name: result.Name,
      description: result.description,
      instructions: result.instructions,
      network: result.network,
      task_id: result.campaign_id,
      offer_id: result.offer_id,
      category_id: result.category_id,
      image: (result.image?.includes('http') || !result.image) ? result.image : `${imagePrefix}/${result.image}`,
      // @ts-ignore
      url: (req.userTier && result.tier && req.userTier < result.tier) ? '#' : result.url.replace("#USER_ID", req.userId),
      payout: result.payout,
      payout_type: result.payout_type,
      countries: result.countries ? JSON.parse(result.countries) : null,
      platforms: result.platforms ? JSON.parse(result.platforms) : null,
      status: result.status,
      tier: result.tier,
      is_featured: result.is_featured,
      banner_image: result.banner_image ? `${imagePrefix}/${result.banner_image}` : null,
      tracking_speed: result.tracking_speed,
      slug: result.slug,
      open_external_browser: result.open_task_external_browser ? result.open_task_external_browser : result.app_open_external_browser,
      screenshot_upload: result.screenshot_upload,
      screenshot_instructions: result.screenshot_instructions,
      goals_count: result.goals_count,
      // goals: result.network_goals ? JSON.parse(result.network_goals) : null,
      goals: networkGoalsWithStatus,
      provider: {
        code: result.code,
        name: result.network_name,
        icon: (result.network_icon?.includes('http') || !result.network_icon) ? result.network_icon : `${imagePrefix}/${result.network_icon}`,
        logo: (result.network_logo?.includes('http') || !result.network_logo) ? result.network_logo : `${imagePrefix}/${result.network_logo}`,
        render_type: result.render_type,
      },
      category: {
        name: result.name,
        id: result.category_id,
        icon: (result.category_icon?.includes('http') || !result.category_icon) ? result.category_icon : `${imagePrefix}/${result.category_icon}`,
        bg_color: result.bg_color,
        sort_order: result.sort_order,
      },
      userDetails: userDetails,
      user_screenshot_upload: screenshotDetails ? screenshotDetails.upload_path : null,
      currency: currencySymbol,
    },
    200,
    "null",
    null,
    null
  );
};

export const detailsBySlug = async (req: FastifyRequest, reply: FastifyReply) => {
  const currency: any = await getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  const { slug } = req.params as {
    slug: string;
  };
  const lang = req.headers["x-language"];
  const result = await task.detailsBySlug(
    slug,
    Number(req.userId),
    lang?.toString() || "en"
  );
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.val,
  });

  const parts: any = formatter.formatToParts(0);
  const currencySymbol = parts.find(
    (part: any) => part.type === "currency"
  ).value;
  const userDetails = await findUser(Number(req.userId));
  if (!result) {
    return reply.sendError(app.polyglot.t("error.task.detailsNotFound"), 404);
  }

  const screenshotDetails = await task.fetchUserUpload(Number(req.userId), result.network, result.campaign_id)


  const networkGoalsWithStatus = await task.getUserTaskGoalsStatus(result.network, result.campaign_id, Number(req.userId), lang?.toString() || "en");

  return reply.sendSuccess(
    {
      id: result.task_id,
      name: result.Name,
      description: result.description,
      instructions: result.instructions,
      network: result.network,
      task_id: result.campaign_id,
      offer_id: result.offer_id,
      category_id: result.category_id,
      image: (result.image?.includes('http') || !result.image) ? result.image : `${imagePrefix}/${result.image}`,
      // @ts-ignore
      url: (req.userTier && result.tier && req.userTier < result.tier) ? '#' : result.url.replace("#USER_ID", req.userId),
      url_param:result.sub_id,
      payout: result.payout,
      payout_type: result.payout_type,
      countries: result.countries ? JSON.parse(result.countries) : null,
      platforms: result.platforms ? JSON.parse(result.platforms) : null,
      status: result.status,
      tier: result.tier,
      is_featured: result.is_featured,
      banner_image: result.banner_image ? `${imagePrefix}/${result.banner_image}` : null,
      tracking_speed: result.tracking_speed,
      slug: result.slug,
      open_external_browser: result.open_task_external_browser ? result.open_task_external_browser : result.app_open_external_browser,
      screenshot_upload: result.screenshot_upload,
      screenshot_instructions: result.screenshot_instructions,
      goals_count: result.goals_count,
      goals: networkGoalsWithStatus,
      provider: {
        code: result.code,
        name: result.network_name,
        icon: (result.network_icon?.includes('http') || !result.network_icon) ? result.network_icon : `${imagePrefix}/${result.network_icon}`,
        logo: (result.network_logo?.includes('http') || !result.network_logo) ? result.network_logo : `${imagePrefix}/${result.network_logo}`,
        render_type: result.render_type,
      },
      category: {
        name: result.name,
        id: result.category_id,
        icon: (result.category_icon?.includes('http') || !result.category_icon) ? result.category_icon : `${imagePrefix}/${result.category_icon}`,
        bg_color: result.bg_color,
        sort_order: result.sort_order,
      },
      userDetails: userDetails,
      user_screenshot_upload: screenshotDetails ? screenshotDetails.upload_path : null,
      currency: currencySymbol,
    },
    200,
    "null",
    null,
    null
  );
};


export const activeTaskProviders = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  const result = await task.activeTaskProviders(
    Number(req.userId),
    lang?.toString() || 'en'
  );

  let providers = result.providers;

  reply.sendSuccess(
    providers,
    200,
    "Fetched SuccessFull",
    null,
    null
  );
};

export const active = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  const { page, limit, name, platform, network } = req.query as { page: any, limit: any, name: any, platform: any, network: any };
  const result = await task.userActiveTask(
    name != undefined ? `%${name}%` : null,
    Number(req.userId),
    lang?.toString() || "en",
    network,
    page,
    limit
  );
  if (!result) {
    return reply.sendSuccess(null, 200, "Active Task Not found", 0, 0);
  }
  const lastPage = limit
    ? Number(result.count) / Number(limit)
    : Number(result.count) / 20;
  return reply.sendSuccess(
    result.transformedData.map((task: any) => ({
      id: task.task_id,
      name: task.Name,
      description: task.description,
      network: task.network,
      campaign_id: task.campaign_id,
      offer_id: task.offer_id,
      category_id: task.category_id,
      image: (task.image?.includes('http') || !task.image) ? task.image : `${imagePrefix}/${task.image}`,
      url: task.url.replace("#USER_ID", req.userId),
      payout: task.payout,
      payout_type: task.payout_type,
      countries: task.countries ? JSON.parse(task.countries) : null,
      platforms: task.platforms ? JSON.parse(task.platforms) : null,
      is_featured: task.is_featured,
      banner_image: task.banner_image ? `${imagePrefix}/${task.banner_image}` : null,
      tracking_speed: task.tracking_speed,
      slug: task.slug,
      tier: task.tier,
      networkIcon: (task.network_icon?.includes('http') || !task.network_icon) ? task.network_icon : `${imagePrefix}/${task.network_icon}`,
      provider: {
        code: task.code,
        name: task.network,
        icon: (task.network_icon?.includes('http') || !task.network_icon) ? task.network_icon : `${imagePrefix}/${task.network_icon}`,
        support_url:
          task.support_url != null || task.support_url != undefined
            ? task.support_url
              .replace(
                "#USER_ID",

                req.userId
              )
              .replace("#OFFER_ID", task.campaign_id)
            : null,
        render_type: task.render_type,
      },
      category: {
        name: task.name,
        id: task.category_id,
        icon: (task.category_icon?.includes('http') || !task.category_icon) ? task.category_icon : `${imagePrefix}/${task.category_icon}`,
        bg_color: task.bg_color,
        sort_order: task.sort_order,
      },
      clicked_on: task.clicked_on,
    })),
    200,
    "null",
    page,
    Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
  );
};

export const recommended = async (req: FastifyRequest, reply: FastifyReply) => {
  const country_code = req.headers["cf-ipcountry"] ?? "XX";
  const lang = req.headers["x-language"] ?? "en";
  const { name, platform, page, limit } = req.query as { name: any, platform: any, page: any, limit: any };
  const ArrPlat: string[] | null = platform ? platform.split(",") : null;
  const result = await task.recommended(
    name != undefined ? `%${name}%` : null,
    typeof ArrPlat != undefined || ArrPlat ? ArrPlat : null,
    lang?.toString(),
    country_code?.toString(),
    Number(page) || null,
    limit != null ? parseInt(limit.toString()) : limit,
  );
  const lastPage = limit
    ? Number(result?.count) / Number(limit)
    : Number(result?.count) / 20;
  if (result != null) {
    const tasks = result.transformedData.map((task: any) => ({
      id: task.task_id,
      name: task.Name,
      description: task.description,
      // instructions: task.instructions,
      network: task.network,
      task_id: task.campaign_id,
      offer_id: task.offer_id,
      category_id: task.category_id,
      image: (task.image?.includes('http') || !task.image) ? task.image : `${imagePrefix}/${task.image}`,
      url: task.url,
      payout: task.payout,
      payout_type: task.payout_type,
      countries: task.countries ? JSON.parse(task.countries) : null,
      platforms: task.platforms ? JSON.parse(task.platforms) : null,
      // status: task.status,
      tier: task.tier,
      is_featured: task.is_featured,
      banner_image: task.banner_image ? `${imagePrefix}/${task.banner_image}` : null,
      tracking_speed: task.tracking_speed,
      slug: task.slug,
      open_external_browser: task.open_task_external_browser ? task.open_task_external_browser : task.app_open_external_browser,
      // goals_count: task.goals_count,
      // goals: task.network_goals ? JSON.parse(task.network_goals) : null,
      provider: {
        code: task.code,
        name: task.network,
        icon: (task.network_icon?.includes('http') || !task.network_icon) ? task.network_icon : `${imagePrefix}/${task.network_icon}`,
        logo: (task.network_logo?.includes('http') || !task.network_logo) ? task.network_logo : `${imagePrefix}/${task.network_logo}`,
        render_type: task.render_type,
      },
      category: {
        name: task.name,
        id: task.category_id,
        icon: (task.category_icon?.includes('http') || !task.category_icon) ? task.category_icon : `${imagePrefix}/${task.category_icon}`,
        bg_color: task.bg_color,
        sort_order: task.sort_order,
      },
    }));

    return reply.sendSuccess(
      tasks,
      200,
      null,
      page,
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendSuccess(null, 200, "Task Not found", 0, 0);
  }
}

export const vip = async (req: FastifyRequest, reply: FastifyReply) => {
  const country_code = req.headers["cf-ipcountry"] ?? "XX";
  const lang = req.headers["x-language"] ?? "en";
  const { name, platform } = req.query as { name: any, platform: any };

  const ArrPlat: string[] | null = platform ? platform.split(",") : null;

  const userId = req.userId;
  const userTier = req.userTier;

  const result = await task.vip(
    name != undefined ? `%${name}%` : null,
    typeof ArrPlat != undefined || ArrPlat ? ArrPlat : null,
    lang?.toString(),
    country_code?.toString(),
    Number(userTier)
  );

  if (result != null) {
    const tasks = result.map((task: any) => ({
      id: task.task_id,
      name: task.Name,
      description: task.description,
      // instructions: task.instructions,
      network: task.network,
      task_id: task.campaign_id,
      offer_id: task.offer_id,
      category_id: task.category_id,
      image: (task.image?.includes('http') || !task.image) ? task.image : `${imagePrefix}/${task.image}`,
      url: task.url,
      payout: task.payout,
      payout_type: task.payout_type,
      countries: task.countries ? JSON.parse(task.countries) : null,
      platforms: task.platforms ? JSON.parse(task.platforms) : null,
      // status: task.status,
      tier: task.tier,
      is_featured: task.is_featured,
      banner_image: task.banner_image ? `${imagePrefix}/${task.banner_image}` : null,
      tracking_speed: task.tracking_speed,
      slug: task.slug,
      open_external_browser: task.open_task_external_browser ? task.open_task_external_browser : task.app_open_external_browser,
      // goals_count: task.goals_count,
      // goals: task.network_goals ? JSON.parse(task.network_goals) : null,
      provider: {
        code: task.code,
        name: task.network,
        icon: (task.network_icon?.includes('http') || !task.network_icon) ? task.network_icon : `${imagePrefix}/${task.network_icon}`,
        logo: (task.network_logo?.includes('http') || !task.network_logo) ? task.network_logo : `${imagePrefix}/${task.network_logo}`,
        render_type: task.render_type,
      },
      category: {
        name: task.name,
        id: task.category_id,
        icon: (task.category_icon?.includes('http') || !task.category_icon) ? task.category_icon : `${imagePrefix}/${task.category_icon}`,
        bg_color: task.bg_color,
        sort_order: task.sort_order,
      },
    }));
    return reply.sendSuccess(
      tasks,
      200,
      null,
      null,
      null
    );
  } else {
    return reply.sendSuccess(null, 200, "Task Not found", 0, 0);
  }
}

export const screenshotUpload = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  const file = (req as any).file;
  if (!file) {
    return reply.sendError(app.polyglot.t("error.images.imageNotFound"), 400);
  }
  const { platform, network, campaignId } = req.body as { platform: string, network: string, campaignId: string }
  if (!campaignId || !network || !platform) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return reply.sendError(app.polyglot.t("error.task.inputsNotReceived"), 400);
  }


  //check if network is valid
  const validNetwork = await db
    .selectFrom("offerwall_networks")
    .selectAll()
    .where("code", "=", network)
    .executeTakeFirst()
  if (!validNetwork) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    reply.sendError(app.polyglot.t("error.task.invalidProvider"), 400)
  }
  //check if tasks is valid and screenshot enabled
  const validTask = await db
    .selectFrom("offerwall_tasks")
    .selectAll()
    .where("offer_id", '=', `${network}_${campaignId}`)
    .where("screenshot_upload", "!=", 0)
    .executeTakeFirst()
  if (!validTask) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    reply.sendError(app.polyglot.t("error.task.invalidTask"), 400)
  }
  //platform must be valid
  if (validTask!.platforms && !validTask!.platforms.includes(platform)) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return reply.sendError(app.polyglot.t("error.task.invalidPlatform"), 400)
  }
  //check if user screenshot already exists
  const existingUpload = await db
    .selectFrom("user_task_uploads")
    .selectAll()
    .where("task_offer_id", '=', `${network}_${campaignId}`)
    .where("user_id", '=', parseInt(req.userId))
    .executeTakeFirst()

  if (existingUpload) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return reply.sendError(app.polyglot.t("error.images.imageExists"), 400);
  }

  //move the file from temp to final
  const tempFilePath = file.path;
  const finalPath = await moveUploadedFile(tempFilePath, 'uploads/screenshots');
  //prepare screenshot object
  const screenshot = {
    filename: file.filename,
    path: finalPath,
    url: `${config.env.app.appUrl}/${path.basename('uploads')}/screenshots/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size
  }
  //insert the screenshot 
  const insert = await task.insert(validNetwork!.code, validTask!.campaign_id, platform, screenshot.url, parseInt(req.userId))
  if (!insert) {
    if (screenshot && screenshot.path && fs.existsSync(screenshot.path)) {
      fs.unlinkSync(screenshot.path);
    }
    return reply.sendError(app.polyglot.t("error.insertionFailed"), 500)
  }
  //logic for handling postback for own network
  if (network === "savebucks") {

    let uniqueTransactionId;
    let isUnique = false;

    // Keep generating IDs until we find one that doesn't exist in the database
    while (!isUnique) {
      uniqueTransactionId = uuidv4();

      // Check if this transaction ID already exists
      const existingTransaction = await db
        .selectFrom('user_offerwall_sales')
        .select(['id'])
        .where('transaction_id', '=', uniqueTransactionId)
        .executeTakeFirst();

      // If no record found with this transaction ID, it's unique
      if (!existingTransaction) {
        isUnique = true;
      }
    }

    //calculating amount based on payout and conversion rate
    const conversion_rate = Number(validNetwork?.cashback_percent) * 0.01;
    if (!validTask?.payout) {
      return reply.sendError(app.polyglot.t("error.invalidPayout"), 400);
    }

    // Convert payout to number if it's a string and calculate half
    const payoutValue = typeof validTask.payout === 'string'
      ? parseFloat(validTask.payout)
      : validTask.payout;

    const amount = payoutValue * conversion_rate;

    //prepare params for postback
    const networkDetails = await postback.getNetworkDetails("tasks", "savebucks")
    const params = {
      hash: networkDetails?.postback_validation_key,
      typ: 'tasks',
      net: networkDetails?.code,
      iky: networkDetails?.postback_validation_key,
      uid: req.userId,
      tid: uniqueTransactionId!, //randomly generate
      sts: 'pending',
      amt: amount.toFixed(2),
      pyt: payoutValue.toFixed(2),
      oid: campaignId,
      onm: JSON.parse(validTask?.name).en,
    };

    const responsePostback = await axios.get(`${config.env.app.appUrl}/api/v1/postback`, { params });
    if (responsePostback.status !== 200) {
      reply.sendError(app.polyglot.t("error.postbackFailed"), 500)
    }

    const response = await axios.post(`${config.env.admin.url}/update/usertask`, {
      task_id: campaignId,
      network: networkDetails?.code,
      status: "pending"
    });
    if (response.status !== 200) {
      reply.sendError(app.polyglot.t("error.adminFailed"), 500)
    }

  }
  //send success
  const result = await task.fetchUserUpload(parseInt(req.userId), validNetwork!.code, validTask!.campaign_id)
  if (!result) {
    if (screenshot && screenshot.path && fs.existsSync(screenshot.path)) {
      fs.unlinkSync(screenshot.path);
    }
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500)
  }
  return reply.sendSuccess(result, 200, "Screenshot Uploaded successfully", null, null)

}
export const fetchUrl = async (req: FastifyRequest, reply: FastifyReply) => {
  const { code } = req.params as { code: string };
  const result = await providers.fetchDetails(code);
  let userMacros = {};

  if (result) {
    userMacros = {
      USER_ID: req.userId,
      SECURE_HASH: crypto
        .createHash("md5")
        .update(`${req.userId}-${result[0].postback_key}`)
        .digest("hex"),
      USER_NAME: req.userName,
      USER_EMAIL: req.userEmail,
      token: result[0].app_id,
    };

    const response: any = result.map((network: any) => {
      if (network.survey_url == null) {
        return {
          offer_url: replaceMacros(network.offer_url, userMacros),
        };
      }
      const updatedSurveyUrl = replaceMacros(network.survey_url, userMacros);

      return {
        survey_url: updatedSurveyUrl,
      };
    });

    return reply.sendSuccess(response, 200, "null", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.notFound"), 404);
  }
};
