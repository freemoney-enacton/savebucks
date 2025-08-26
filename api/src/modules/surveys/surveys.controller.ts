// import * as surveys from "./surveys.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { decodeToken } from "../auth/jwt";
import {
  getBitlabsData,
  getBitlabsNetworkData,
} from "./surveys_strategies/getBitlabsData";
import { getCachedData } from "./surveys.cache";
import collect from "collect.js";
import crypto from "crypto";
import * as providers from "../providers/offerProviders.model";
import app from "../../app";
import { replaceMacros } from "../../utils/replaceMacros";
import { generateClickCode } from "../clicks/clicks.controller";
import * as click from "../clicks/clicks.model";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { provider, country, sort, page } = req.query as {
    provider: string;
    country: string;
    sort: string;
    page: any;
  };
  const token = req.cookies.token || req.headers["Authorization"];
  const decoded = await decodeToken(reply, token);
  const cacheKey: string = `surveys_${provider}_${decoded.id}`;
  const data = await getCachedData(
    cacheKey,
    () => getBitlabsData(req, decoded.id, null),
    "60"
  );

  // Assuming data is an array of surveys
  let surveyCollection = collect(data);

  switch (sort) {
    case "length":
      surveyCollection = surveyCollection.sortBy("length_loi");
      break;
    case "highest":
      surveyCollection = surveyCollection.sortByDesc("payout");
      break;
    case "lowest":
      surveyCollection = surveyCollection.sortBy("payout");
    default:
      surveyCollection = surveyCollection;
    // No default case needed, if sort is undefined or doesn't match, don't sort
  }
  const perPage = 20;
  const offset = (page - 1) * perPage;
  surveyCollection = surveyCollection.slice(offset, offset + perPage);
  return reply.sendSuccess(surveyCollection.all(), 200, "null", null, null);

  // return reply.status(200).send({
  //   success: true,
  //   data: surveyCollection.all(), // Convert back to array
  //   error: null,
  //   msg: null,
  //   pagination: {
  //     page,
  //     perPage,
  //     total: surveyCollection.count(),
  //   },
  // });
};
export const fetchUrl = async (req: FastifyRequest, reply: FastifyReply) => {
  const { code } = req.params as { code: string };
  const result = await providers.fetchDetails(code);
  let userMacros = {};

  const country_code = req.headers["x-country"] ?? req.headers["cf-ipcountry"] ?? "unknown";
  const client_ip = req.headers["x-client-ip"] ?? req.headers["cf-connecting-ip"];
  const userId = Number(req.userId);
  const locale = req.headers["accept-language"] || ("en" as string);
  const userAgent = req.headers["user-agent"] as string;
  const referer = req.headers["referer"] as any;
  const platform = Array.isArray(req.headers["is-app"]) ? req.headers["is-app"][0] : "web";

  let click_code: string="";
  const maxAttempts = 5;

  for (let i = 0; i < maxAttempts; i++) {
    click_code = generateClickCode();

    // Assume you have a DB method to check uniqueness
    const exists = await click.doesClickCodeExist(click_code);
    if (!exists) break;

    if (i === maxAttempts - 1) {
      return reply.sendError(app.polyglot.t("error.clickCodeGenerationFailed"), 500);
    }
  }



  const clicks = await click.clickInsert(
    userId,
    platform,
    code,
    "surveys",
    `${code}_iframe`,
    "iframe",
    locale?.toString(),
    country_code?.toString(),
    userAgent?.toString(),
    client_ip?.toString(),
    referer?.toString(),
    click_code
  );
  if(!clicks){
    return reply.sendError(app.polyglot.t("error.insertFailed"), 500);
  }

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
      TIMESTAMP: Date.now(),
    };

    const response: any = result.map((network: any) => {
      if (network.survey_url == null) {
        return {
          survey_url: null,
          offer_url: network.offer_url,
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
