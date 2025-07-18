import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as giftcardController from "./giftcard.controller"

export default async function (app:FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().route({
        method:"GET",
        url:"/",
        schema:{
            tags:["payments"],
            headers:z.object({
                "x-language":z.string({
                    required_error:app.polyglot
                    .t("error.zod.requiredError")
                    .replace("#VAR","Language"),
                }),
            }),
            response:{
                //200
            },


            
        },
        handler:giftcardController.fetch
    })
}