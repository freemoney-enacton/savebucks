import { FastifyReply, FastifyRequest } from "fastify";
import * as click from "./clicks.model";
import app from "../../../app";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { page, limit, date } = req.query as {
    page: string;
    limit: string;
    date: string;
  };
  const result = await click.fetch(
    Number(page),
    Number(limit),
    date,
    Number(req.userId)
  );
  if (result) {
    const lastPage = limit
      ? Number(result?.count) / Number(limit)
      : Number(result?.count) / 20;
    reply.sendSuccess(
      await Promise.all(
        result.clicks
      ),
      200,
      "Fetched SuccessFull",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const fetchDateClicked = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await click.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};


