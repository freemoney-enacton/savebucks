import { FastifyReply } from "fastify";
export function success(
  reply: FastifyReply,
  statusCode: number,
  data: any,
  msg: string | null,
  currentPage: any,
  lastPage: any
) {
  return reply.status(statusCode).send({
    success: true,
    data: data,
    error: null,
    msg: msg,
    currentPage: currentPage ? currentPage : null,
    lastPage: lastPage ? lastPage : null,
  });
}
export function error(reply: FastifyReply, statusCode: number, error: string) {
  return reply.status(statusCode).send({
    success: false,
    error: error,
  });
}
