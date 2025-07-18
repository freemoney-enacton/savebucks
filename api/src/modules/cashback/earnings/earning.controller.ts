import app from "../../../app";
import { db } from "../../../database/database";
import { getSetCachedData } from "../../../utils/getCached";
import { currencyTransform } from "./../../../utils/transformResponse";
import * as earnings from "./earning.model";
import { FastifyReply, FastifyRequest } from "fastify";



export const list = async (req: FastifyRequest, reply: FastifyReply) => {
  const { month_year, page, limit, status } = req.query as {
    status: "pending" | "confirmed" | "declined" | null;
    month_year: string | null;
    limit: string | null;
    page: string | undefined;
  };
  const lang = req.headers["x-language"];
  const result = await earnings.lists(
    Number(req.userId),
    status,
    month_year,
    Number(limit),
    Number(page),
    lang?.toString() || "en"
  );
  if (result) {
    const lastPage = limit
      ? Number(result?.count) / Number(limit)
      : Number(result?.count) / 20;
    reply.sendSuccess(
      result.earnings,
      200,
      "Fetched SuccessFull",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const stats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.stats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const dateFormat = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};


