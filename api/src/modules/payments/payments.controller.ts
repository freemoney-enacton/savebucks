import { FastifyReply, FastifyRequest } from "fastify";
import * as payment from "./payments.model";
import { bodyType } from "./payments.schema";
import { activityConfig } from "../../config/activityConfig";
import { dispatchEvent } from "../../events/eventBus";
import { sendActivitiesNotification } from "../../utils/sendUserActivities";
import app from "../../app";
import { db } from "../../database/database";
import { getSetCachedData } from "../../utils/getCached";
import { currencyTransform } from "../../utils/transformResponse";
import { insertTicker } from "../ticker/ticker.model";
import { fetchBySku } from "./giftcards/giftcard.model";
import { de } from "@faker-js/faker";

export const insert = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  const userId = Number(req.userId);
  const {
    payment_method_code,
    account,
    payment_input,
    amount,
    pay_amount,
    receivable_amount,
    cashback_amount,
    bonus_amount,
    additional_info
  } = req.body as {
    payment_method_code: string;
    account: string;
    payment_input: string;
    amount: number;
    pay_amount: number;
    receivable_amount: number;
    cashback_amount?: number;
    bonus_amount?: number;
    additional_info?: {
      sku: string;
      name: string;
      currency: string;
      amount: number|string;
    };
  };
  //console.log(req.body)
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
  const default_lang: any = await getSetCachedData(
    "default_language",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_lang")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  console.log("body", req.body)



  const user = req.user as any;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.val,
  });

  const parts: any = formatter.formatToParts(0);
  const currencySymbol = parts.find(
    (part: any) => part.type === "currency"
  ).value;
  const totalAmount = await payment.fetchAmount(userId);

  const checkMethodCode = await payment.fetchType(payment_method_code, lang);
  if (!checkMethodCode) {
    return reply.sendError(
      app.polyglot.t("error.user.invalidPaymentCode"),
      404
    );
  }

  const existingRequest = await payment.fetchAlreadyProcessingRequest(userId);
  if (existingRequest) {
    return reply.sendError(
      app.polyglot
        .t("error.withdrawalRequestExists"),
      400
    );
  }
  if (
    checkMethodCode?.country_customizable == 1 &&
    pay_amount > 0 &&
    receivable_amount > 0
  ) {
    if (pay_amount < Number(checkMethodCode.minimum_amount)) {
      return reply.sendError(
        app.polyglot
          .t("error.withdrawalRequestExists")
          .replace("#CURRENCY_SYMBOL", currencySymbol)
          .replace("#MINIMUM_AMOUNT", checkMethodCode.minimum_amount),
        400
      );
    }


    let payable_amount = pay_amount;
    //console.log("🚀 ~ before any changes ~ payable_amount:", payable_amount)
    let withdrawable_amount = pay_amount;


    // Calculate the transaction fees if applicable
    if (checkMethodCode.transaction_fees_allowed == 1) {
      if (checkMethodCode.transaction_fees_type === "fixed") {
        const payAmtTrans =
          pay_amount + Number(checkMethodCode.transaction_fees_amount);
        if (totalAmount.total < payAmtTrans) {
          return reply.sendError(
            app.polyglot.t("error.user.insufficientBalance"),
            422
          );
        }
        payable_amount -= Number(checkMethodCode.transaction_fees_amount);
        //console.log("🚀 ~ after fee calculated fixed ~ payable_amount:", payable_amount)
      } else if (checkMethodCode.transaction_fees_type === "percent") {
        const feesAmount =
          (Number(checkMethodCode.transaction_fees_amount) / 100) *
          payable_amount;
        const payAmtTrans = payable_amount + Number(feesAmount);
        if (totalAmount.total < payAmtTrans) {
          return reply.sendError(
            app.polyglot.t("error.user.insufficientBalance"),
            422
          );
        }
        payable_amount -= feesAmount;
        //console.log("🚀 ~ after fee calculated percent ~ payable_amount:", payable_amount)
      }
    }

    // Calculate the bonus amount if applicable
    if (checkMethodCode.transaction_bonus_allowed == 1) {
      if (checkMethodCode.transaction_bonus_type === "fixed") {
        payable_amount += Number(checkMethodCode.transaction_bonus_amount);
        //console.log("🚀 ~ after bonus calculated fixed ~ payable_amount:", payable_amount)
      } else if (checkMethodCode.transaction_bonus_type === "percent") {
        const bonusAmount =
          (Number(checkMethodCode.transaction_bonus_amount) / 100) * pay_amount;
        payable_amount += bonusAmount;
        //console.log("🚀 ~ after bonus calculated percent ~ payable_amount:", payable_amount)
      }
    }

    // Ensure payable_amount is not less than zero
    if (payable_amount < 0) {
      payable_amount = 0;
      return reply.sendError(app.polyglot.t("error.user.feesAmountError"), 422);
    }
    if (checkMethodCode.conversion_enabled == 1) {
      payable_amount = payable_amount * Number(checkMethodCode.conversion_rate);
    }
    if (checkMethodCode.code === "giftcard") {
      const currency = await payment.getCurrencyConversion(additional_info!.currency)

      payable_amount = payable_amount * Number(currency!.conversion_rate);
      
    }

    const proceedAfterKycValidation = await payment.doKycValidations(user);

    if (!proceedAfterKycValidation) {
      reply.sendError(
        app.polyglot
          .t("error.kycVerification.kycVerificatonRequiredOnPayout"),
        400
      );
    }

    // Check if the user's wallet has sufficient funds to cover the amount with transaction fees
    if (totalAmount && totalAmount.total >= payable_amount) {
      const paymentId = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      const result = await payment.insert({
        payment_id: Number(paymentId),
        user_id: userId,
        payment_method_code: payment_method_code,
        account: account,
        payment_input: payment_method_code === "giftcard" ? JSON.stringify(additional_info) : JSON.stringify(payment_input),
        amount: payment_method_code === "giftcard"?payable_amount:pay_amount,
        payable_amount: payable_amount,
        status: "created",
        cashback_amount: cashback_amount,
        bonus_amount: bonus_amount,
      });

      if (result) {
        await sendActivitiesNotification({
          user_id: Number(userId),
          activity_type: "payouts",
          icon: activityConfig.payouts.icon,
          title: activityConfig.payouts.title_status_confirmed,
          status: "confirmed",
          url: activityConfig.payouts.url,
          amount: Number(amount),
          data: JSON.stringify({ message: "Payout Confirmed" }),
        });
        dispatchEvent("send_email", {
          type: "payout_request",
          user_payment_id: Number(result.insertId),
        });
        let giftcardDetails = null;
        if (checkMethodCode.code === "giftcard") {
          giftcardDetails = await fetchBySku(lang, default_lang, additional_info!.sku)
        }
        await insertTicker(
          userId,
          "Cashout",
          JSON.stringify({
            userName: req.userName,
            paymentMethod: checkMethodCode.code === "giftcard" ? giftcardDetails?.name : checkMethodCode.name,
            image: checkMethodCode.code === "giftcard" ? giftcardDetails?.image : checkMethodCode.image,
            amount: payable_amount,
          })
        );
        return reply.sendSuccess(
          "",
          200,
          "Payment Request Created Successfully",
          null,
          null
        );
      } else {
        await sendActivitiesNotification({
          user_id: userId,
          activity_type: "payouts",
          icon: activityConfig.payouts.icon,
          title: activityConfig.payouts.title_status_confirmed,
          status: "declined",
          url: activityConfig.payouts.url,
          amount: Number(amount),
          data: JSON.stringify({ message: "Payout Declined" }),
        });
        return reply.sendError(app.polyglot.t("error.user.paymentFailed"), 500);
      }
    } else {
      await sendActivitiesNotification({
        user_id: userId,
        activity_type: "payouts",
        icon: activityConfig.payouts.icon,
        title: activityConfig.payouts.title_status_confirmed,
        status: "declined",
        url: activityConfig.payouts.url,
        amount: Number(amount),
        data: JSON.stringify({ message: "Insufficient Balance" }),
      });
      return reply.sendError(
        app.polyglot.t("error.user.insufficientBalance"),
        400
      );
    }
  } else {
    if (!amount || amount < 0 || isNaN(amount)) {
      return reply.sendError(app.polyglot.t("error.user.invalidAmount"), 400);
    }
    if (amount < Number(checkMethodCode.minimum_amount)) {
      return reply.sendError(
        app.polyglot
          .t("error.user.minimumAmount")
          .replace("#CURRENCY_SYMBOL", currencySymbol)
          .replace("#MINIMUM_AMOUNT", checkMethodCode.minimum_amount),
        400
      );
    }

    let payable_amount = amount;
    //console.log("payable amount before calc", payable_amount)

    if (checkMethodCode.transaction_fees_allowed == 1) {
      if (checkMethodCode.transaction_fees_type === "fixed") {
        const payAmtTrans =
          amount + Number(checkMethodCode.transaction_fees_amount);
        if (totalAmount.total < payAmtTrans) {
          //console.log("🚀 ~ insufficient balance ~ totalAmount:", totalAmount, "payAmtTrans:", payAmtTrans)
          return reply.sendError(
            app.polyglot.t("error.user.insufficientBalance"),
            422
          );
        }
        payable_amount -= Number(checkMethodCode.transaction_fees_amount);
      } else if (checkMethodCode.transaction_fees_type === "percent") {
        const feesAmount =
          (Number(checkMethodCode.transaction_fees_amount) / 100) *
          amount;
        const payAmtTrans = payable_amount + Number(feesAmount);
        if (totalAmount.total < payAmtTrans) {
          //console.log("🚀 ~ insufficient balance ~ totalAmount:", totalAmount, "payAmtTrans:", payAmtTrans)
          return reply.sendError(
            app.polyglot.t("error.user.insufficientBalance"),
            422
          );
        }
        payable_amount -= feesAmount;
      }
    }
    // Calculate the bonus amount if applicable
    if (checkMethodCode.transaction_bonus_allowed == 1) {
      if (checkMethodCode.transaction_bonus_type === "fixed") {
        payable_amount += Number(checkMethodCode.transaction_bonus_amount);
      } else if (checkMethodCode.transaction_bonus_type === "percent") {
        const bonusAmount =
          (Number(checkMethodCode.transaction_bonus_amount) / 100) * amount;
        payable_amount += bonusAmount;
      }
    }

    // Calculate the transaction fees if applicable

    // Ensure payable_amount is not less than zero
    if (payable_amount < 0) {
      payable_amount = 0;
      return reply.sendError(app.polyglot.t("error.user.feesAmountError"), 422);
    }
    if (checkMethodCode.conversion_enabled == 1) {
      payable_amount = payable_amount * Number(checkMethodCode.conversion_rate);
    }
    if (checkMethodCode.code === "giftcard") {
      const currency = await payment.getCurrencyConversion(additional_info!.currency)

      payable_amount = payable_amount * Number(currency!.conversion_rate);
    }

    const proceedAfterKycValidation = await payment.doKycValidations(user);

    if (!proceedAfterKycValidation) {
      reply.sendError(
        app.polyglot
          .t("error.kycVerification.kycVerificatonRequiredOnPayout"),
        400
      );
    }

    // Check if the user's wallet has sufficient funds to cover the amount with transaction fees
    if (totalAmount && totalAmount.total >= payable_amount) {
      const paymentId = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      const result = await payment.insert({
        payment_id: Number(paymentId),
        user_id: userId,
        payment_method_code: payment_method_code,
        account: account,
        payment_input: payment_method_code === "giftcard" ? JSON.stringify(additional_info) : JSON.stringify(payment_input),
        amount: payment_method_code === "giftcard"?payable_amount:pay_amount,
        payable_amount: payable_amount,
        status: "created",
        cashback_amount: cashback_amount,
        bonus_amount: bonus_amount,
      });

      if (result) {
        await sendActivitiesNotification({
          user_id: Number(userId),
          activity_type: "payouts",
          icon: activityConfig.payouts.icon,
          title: activityConfig.payouts.title_status_confirmed,
          status: "confirmed",
          url: activityConfig.payouts.url,
          amount: Number(amount),
          data: JSON.stringify({ message: "Payout Confirmed" }),
        });
        dispatchEvent("send_email", {
          type: "payout_request",
          user_payment_id: Number(result.insertId),
        });
        let giftcardDetails = null;
        if (checkMethodCode.code === "giftcard") {
          giftcardDetails = await fetchBySku(lang, default_lang?.val, additional_info!.sku)
        }
        await insertTicker(
          userId,
          "Cashout",
          JSON.stringify({
            userName: req.userName,
            paymentMethod: checkMethodCode.code === "giftcard" ? giftcardDetails?.name : checkMethodCode.name,
            image: checkMethodCode.code === "giftcard" ? giftcardDetails?.image : checkMethodCode.image,
            amount: payable_amount,
          })
        );
        return reply.sendSuccess(
          "",
          200,
          "Payment Request Created Successfully",
          null,
          null
        );
      } else {
        await sendActivitiesNotification({
          user_id: userId,
          activity_type: "payouts",
          icon: activityConfig.payouts.icon,
          title: activityConfig.payouts.title_status_confirmed,
          status: "declined",
          url: activityConfig.payouts.url,
          amount: Number(amount),
          data: JSON.stringify({ message: "Payout Declined" }),
        });
        return reply.sendError(app.polyglot.t("error.user.paymentFailed"), 500);
      }
    } else {
      await sendActivitiesNotification({
        user_id: userId,
        activity_type: "payouts",
        icon: activityConfig.payouts.icon,
        title: activityConfig.payouts.title_status_confirmed,
        status: "declined",
        url: activityConfig.payouts.url,
        amount: Number(amount),
        data: JSON.stringify({ message: "Insufficient Balance" }),
      });
      //console.log("🚀 ~ insufficient balance ~ totalAmount:", totalAmount, "payable_amount:", payable_amount)
      return reply.sendError(
        app.polyglot.t("error.user.insufficientBalance"),
        400
      );
    }
  }
};

export const stats = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = Number(req.userId);
  const result = await payment.stats(userId);
  if (result) {
    return reply.sendSuccess(result, 200, "null", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = Number(req.userId);
  const { page, limit, type, status, date } = req.query as {
    page: string | null;
    limit: string | null;
    type: string;
    status: "created" | "processing" | "completed" | "declined" | null;
    date: string | null;
  };
  const lang = req.headers["x-language"];
  const result = await payment.fetch(
    Number(page),
    Number(limit),
    userId,
    type,
    status,
    date,
    lang?.toString() || ""
  );
  if (result) {
    const lastPage = limit
      ? Number(result?.count) / Number(limit)
      : Number(result?.count) / 20;
    return reply.sendSuccess(
      result.payments.map((i: any) => {
        return {
          payment_id: i.payment_id,
          payment_method: i.payment_method_code,
          payment_mode: i.name,
          payment_icon: i.icon,
          account: i.account,
          amount: i.payable_amount,
          transactional_amount: Number(i.amount) != Number(i.payable_amount) ? Number(i.payable_amount) - Number(i.amount) : 0,
          bonus_amount: i.bonus_amount === null ? 0 : i.bonus_amount,
          cashback_amount: i.cashback_amount === null ? 0 : i.cashback_amount,
          status: i.status,
          paid_at: i.paid_at,
          created_at: i.created_at,
        };
      }),
      200,
      "null",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};
export const fetchDate = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await payment.dateFormat();
  if (result) {
    return reply.sendSuccess(result, 200, "null", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};
