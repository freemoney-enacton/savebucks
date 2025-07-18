import { FastifyReply, FastifyRequest } from "fastify";
import * as chat from "./chat.model";
import app from "../../app";
import { number } from "zod";
import { config } from "../../config/config";

export const getRooms = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const country_code = req.headers["x-country"] ?? req.headers["cf-ipcountry"] ?? "unknown";

  // const result = await chat.getRooms();
  // @ts-ignore
  const result = await chat.getRoomsWithCountry(country_code);

  const imagePrefix = `${config.env.app.image_url}`;
  const resultFormated = result.map(r => ({
    ...r, 
    icon: `${imagePrefix}/${r.icon}`,
    default: r.code == 'general' ? true : false
  }))

  return reply.sendSuccess(resultFormated, 200, "Fetched SuccessFull", null, null);
};


export const sendMessage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const {room_code} = req.params as {room_code: string};
  const {message, country} = req.body as {message: string, country: string};
  // @ts-ignore
  const user_id = req.user.id;
  // @ts-ignore
  const user_tier = req.user.current_tier;

  const room = await chat.getRoom(room_code);
  if(!room) return reply.sendError(app.polyglot.t("error.chatRoomNotFound"), 404);

  if(room.tier && (room.tier > user_tier)) return reply.sendError(app.polyglot.t("error.user.insufficientTier"), 400);

  await chat.createMessage(room_code, user_id, message, country);

  return reply.sendSuccess(true, 200, "Fetched SuccessFull", null, null);
};


export const getMessages = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const {room_code} = req.params as {room_code: string};
  const {limit} = req.query as {limit: string};

  // @ts-ignore
  const user_tier = req.user.current_tier;


  const room = await chat.getRoom(room_code);

  if(!room) return reply.sendError(app.polyglot.t("error.chatRoomNotFound"), 404);
  if(room.tier && (room.tier > user_tier)) return reply.sendErrorWithData(app.polyglot.t("error.user.insufficientTier"), 400,{});

  const result = await chat.getMessages(room_code, Number(limit) || 50);

  return reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
};

export const getChatUserInfo = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const {room_code} = req.params as {room_code: string};
  const {user_id} = req.query as {user_id: string};

  // @ts-ignore
  const user_tier = req.user.current_tier;

  const room = await chat.getRoom(room_code);
  if(!room) return reply.sendError(app.polyglot.t("error.roomNotFound"), 404);
  if(room.tier && (room.tier > user_tier)) return reply.sendError(app.polyglot.t("error.user.insufficientTier"), 400);

  const result = await chat.getChatUserInfo(Number(user_id));

  return reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
};