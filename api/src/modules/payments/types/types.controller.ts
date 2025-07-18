import { FastifyReply, FastifyRequest } from "fastify";
import * as payment from "./types.model";
import app from "../../../app";
import { getSetCachedData } from "../../../utils/getCached";
import { db } from "../../../database/database";
import { config } from "../../../config/config";

// import { FetchTaskQuery } from "./task.schemas";
export const fetchTypes = async (req: FastifyRequest, reply: FastifyReply) => {

  const imageUrl = config.env.app.image_url;

  const lang = req.headers["x-language"];

  const userCountry = req.headers["x-country"] ?? req.headers["cf-ipcountry"] ?? "XX";
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await payment.fetchTypes(lang, fallback_lang?.val);
  if (result) {
    reply.sendSuccess(
      {
        paymentTypes: result.details.map((i: any) => {
          let enabledCountries: any[] = [];
          let disabledCountries: any[] = [];
          // if (
          //   i.country_configuration &&
          //   Array.isArray(i.country_configuration)
          // ) {
          //   i.country_configuration.forEach((country: any) => {
          //     if (country.enabled) {
          //       enabledCountries.push(country.country_code);
          //     } else {
          //       disabledCountries.push(country.country_code);
          //     }

          //   });

          // }
          if (i.country_configuration && Array.isArray(i.country_configuration)) {
            i.country_configuration.forEach((country: any) => {
              if (country.enabled) {
                enabledCountries.push(country.country_code);
              } else {
                disabledCountries.push(country.country_code);
              }

              // Calculate receivable amount based on transaction fee and bonus
              if (country.payout_amounts && Array.isArray(country.payout_amounts)) {
                country.payout_amounts.forEach((amount: any) => {
                  let finalReceivableAmount = Number(amount.receivable_amount);

                  // Apply transaction bonus if allowed
                  if (i.transaction_bonus_allowed == 1) {
                    if (i.transaction_bonus_type == "fixed") finalReceivableAmount += Number(i.transaction_bonus_amount)
                    else finalReceivableAmount += (finalReceivableAmount * i.transaction_bonus_amount * 0.01)

                    //console.log("🚀 ~ country.payout_amounts.forEach ~ finalReceivableAmount:", finalReceivableAmount)
                  }

                  // Deduct transaction fee if allowed
                  if (i.transaction_fees_allowed === 1) {
                    if (i.transaction_fees_type == "fixed") finalReceivableAmount -= Number(i.transaction_fees_amount);
                    else finalReceivableAmount -= (finalReceivableAmount * i.transaction_fees_amount * 0.01)

                    //console.log("🚀 ~ country.payout_amounts.forEach ~ finalReceivableAmount:", finalReceivableAmount)
                  }
                  amount.calculated_receivable_amount = finalReceivableAmount
                });
              }
            });
          }
          return {
            id: i.id,
            code: i.code,
            name: i.name,
            card_image: i.card_image?.includes('http') ? i.card_image : `${imageUrl}/${i.card_image}`,
            image: i.image?.includes('http') ? i.image : `${imageUrl}/${i.image}`,
            // image: i.image,
            account_input_type: i.account_input_type,
            account_input_label: i.account_input_label,
            account_input_hint: i.account_input_hint,
            payment_inputs: i.payment_inputs,
            minimum_amount: i.minimum_amount,
            transaction_fees_amount: i.transaction_fees_allowed === 1 ? i.transaction_fees_amount : null,
            transaction_fees_type: i.transaction_fees_type,
            transaction_bonus_amount: i.transaction_bonus_allowed == 1 ? i.transaction_bonus_amount : null,
            transaction_bonus_type: i.transaction_bonus_type,
            cashback_allowed: i.cashback_allowed,
            bonus_allowed: i.bonus_allowed,
            payment_group: i.payment_group,
            enabled: i.enabled,
            enabledCountries:
              enabledCountries.length > 0 ? enabledCountries : [],
            disabledCountries:
              disabledCountries.length > 0 ? disabledCountries : [],
            country_configuration: i.country_configuration,
            description: i.description,
            conversion_enabled: i.conversion_enabled,
            conversion_rate: i.conversion_rate,
          };
        }),
        paymentGroup: [...new Set(result.modes.map((i: any) => i.payment_group))],
        userCountry,
      },
      200,
      "null",
      null,
      null
    );
  } else {
    reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};
