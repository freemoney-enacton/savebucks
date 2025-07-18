import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../app";
import crypto from "crypto";
import * as postback from "./postback.model";
import { UserOfferwallSales } from "../../database/db";
import { dispatchEvent } from "../../events/eventBus";
import axios from "axios";
import { config } from "../../config/config";
import { getSetCachedData } from "../../utils/getCached";
import { db } from "../../database/database";

/**
 * 
  # Flow:
    - get query params
        ```
        hash => * hash used for verification

        typ => * Type tasks | surveys

        net => * network name 
        iky => * internal network key for verification

        uid => * user id
        tid => * unique transaction id (will be same for chargebacks or transaction updates)

        sts => * status for the conversion from network will be verified with network configured configured or declined status
        amt => * amount given to the user
        pyt => * amount recieved by the admin including the user amount

        oid => offer id
        onm => offer name
        gid => goal id for offer

        sid => survey id (if not available --NetworkName Survey + uid--)
        snm => survey name (if not available configure --NetworkName Survey--)

        cip => ip of click
        scr => fraud score if available
        ```
    - validate required fields

    - get network details
    - validate network & network ikey & network ip & network hash

    - get status (default to network.default_conversion_status or 'confirmed')
    - status = network.conversion_statuses['status'] or network.default_conversion_status or 'confirmed'

    - (if status = declined & amount > 0 amount = amount * -1)

    - prepare data to insert
    - create offerwall sales table entry

    - process referrals
        - insert referral earnings for referrer
        - check referrer tier and if applicable update
    - send notification
    - update ticker
    - increase redemptions

    - create log

    - return 1 with 200 status

    - on any error log with failed status and return 0 with non 500 status
 */

type PostbackReqData = {
  hash: string;
  typ: "tasks" | "surveys";
  net: string;
  iky: string;
  uid: string;
  tid: string;
  sts: string;
  amt: string;
  pyt: string;
  oid: string;
  onm: string;
  gid: string;
  sid: string;
  snm: string;
  cip: string;
  scr: string;
};

function createPostbackData(reqData: Record<string, any>, postbackFields: Array<string>, requiredPostbackFields: Array<string>): PostbackReqData {
  // Create postbackData object containing only specified fields
  const postbackData: Partial<PostbackReqData> = {};

  for (const field of postbackFields) {
    if (reqData[field] !== undefined) {
      postbackData[field as keyof PostbackReqData] = reqData[field];
    }
  }

  // Check for missing required fields
  const missingFields = requiredPostbackFields.filter(field => !(field in postbackData));
  if (missingFields.length > 0) {
    throw new Error(`Field(s) required is/are missing: ${missingFields.join(', ')}`);
  }

  // Type assertion to ensure postbackData conforms to PostbackReqData
  return postbackData as PostbackReqData;
}

// TODO: Add this code
const networkSecurityValidation = {
  mocknetwork: async (req: FastifyRequest) => true,
  bitlabs: async (req: FastifyRequest) => true,
  cpx: async (req: FastifyRequest) => true,
  daisycon: async (req: FastifyRequest) => true,
  savebucks: async (req: FastifyRequest) => true,
  ayet: async (req: FastifyRequest) => true,
  notik: async (req: FastifyRequest) => true,
  cpxresearch: async (req: FastifyRequest) => true,
  theoremreach: async (req: FastifyRequest) => true,
  mychips: async (req: FastifyRequest) => true,
  timewall: async (req: FastifyRequest) => true,
  lootably: async (req: FastifyRequest) => true,
  adscendmedia: async (req: FastifyRequest) => true,
  revlum: async (req: FastifyRequest) => true,
  primesurvey: async (req: FastifyRequest) => true
  // ...
}

export const triggerPostback = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let reqdata: PostbackReqData;
    // Get request data
    if (req.method === 'GET') {
      reqdata = req.query as PostbackReqData;
    } else {
      reqdata = req.body as PostbackReqData;
    }

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
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.val,
    });
    const parts: any = formatter.formatToParts(0);

    const currencySymbol = parts.find(
      (part: any) => part.type === "currency"
    ).value;

    // Validate request fields
    const postbackFields = ['hash', 'typ', 'net', 'iky', 'uid', 'tid', 'sts', 'amt', 'pyt', 'oid', 'onm', 'gid', 'sid', 'snm', 'cip', 'scr'];
    const requiredPostbackFields = ["hash", "typ", "net", "iky", "uid", "tid", "sts", "pyt"];
    const postbackData = createPostbackData(reqdata, postbackFields, requiredPostbackFields);

    // Validate as per network data and hash
    const networkDetails = await postback.getNetworkDetails(postbackData.typ, postbackData.net);
    if (!networkDetails) throw new Error("Network not found");
    if (networkDetails?.postback_validation_key != postbackData.iky) throw new Error("Postback Key Mismatch");
    // TODO: Add network ip validation
    // @ts-ignore
    const networkSecurityValidated = postbackData.net && networkSecurityValidation[postbackData.net] ? await networkSecurityValidation[postbackData.net](req) : true;
    // console.log("🚀 ~ triggerPostback ~ postbackData.net:", postbackData.net)
    // console.log("🚀 ~ triggerPostback ~ networkSecurityValidated:", networkSecurityValidated)

    if (!networkSecurityValidated) throw new Error("Invalid Network Security Hash");

    // Determine conversion status, this will be upserted for both usersale and referralsale
    // @ts-ignore
    let conversionStatus = (networkDetails?.conversion_statuses ? networkDetails?.conversion_statuses[postbackData.sts] : null) ?? networkDetails.default_conversion_status ?? postbackData.sts ?? 'confirmed';
    console.log("🚀 ~ triggerPostback ~ conversionStatus:", conversionStatus)

    if (networkDetails.code === "daisycon") {


      const result = await db.selectFrom("user_task_uploads").select(["id"]).where("offer_id", "=", postbackData.oid).where("user_id", "=", Number(postbackData.uid)).executeTakeFirst();

      if (result) {
        conversionStatus = "confirmed"
      }

    }



    // Prepare sale data, this will be upserted.
    const postbackDataDB = {
      task_type: postbackData.typ,
      network: postbackData.net,

      transaction_id: postbackData.tid,
      user_id: postbackData.uid,

      task_offer_id: postbackData.typ == 'surveys' ? `${postbackData.net}_survey` : `${postbackData.net}_${postbackData.oid}`,
      offer_id: postbackData.typ == 'surveys' ? postbackData.sid : postbackData.oid,
      task_name: postbackData.typ == 'surveys' ? postbackData.snm : postbackData.onm,
      network_goal_id: postbackData.gid,

      status: conversionStatus,
      is_chargeback: (conversionStatus == 'declined' || parseFloat(postbackData.amt) < 0) ? 1 : 0,
      amount: (!isNaN(Number(networkDetails.cashback_percent)) &&
        !isNaN(Number(postbackData.pyt)) &&
        networkDetails.cashback_percent != null &&
        postbackData.pyt != null)
        ? (Number(networkDetails.cashback_percent) * Number(postbackData.pyt) * 0.01).toString()
        : postbackData.amt,
      payout: postbackData.pyt,

      click_ip: postbackData.cip
    };
    if (networkDetails.code === "adjoe") {
      postbackDataDB.payout = !isNaN(Number(postbackData.amt)) &&
        !isNaN(Number(networkDetails.cashback_percent)) &&
        Number(networkDetails.cashback_percent) !== 0
        ? (Number(postbackData.amt) / (Number(networkDetails.cashback_percent) * 0.01) * 0.01).toString()
        : postbackData.amt;
      postbackDataDB.amount = (Number(postbackData.amt) * 0.01).toString();
    }
    const userSale = await postback.updateOrCreateUserSale(postbackDataDB);

    const currentUser = await postback.getUserDetails(postbackData.uid)

    // Side Actions:
    // Process Level
    await postback.processLevelCheck(userSale);

    // Process Referral
    // @ts-ignore
    const referralEarning = await postback.processReferral(userSale);
    // Send Notification
    if (postbackDataDB.status == "confirmed") {
      await dispatchEvent("send_user_notification", {
        templateCode: "earning_notification",
        userId: Number(currentUser?.id),
        email: currentUser?.email,
        lang: currentUser?.lang,
        models: [
          {
            task: "tasks",
            amount: Number(userSale?.amount).toFixed(2).toString(),
            network: postbackDataDB.network,
            CURRENCY: currencySymbol,
            OFFER: postbackDataDB.task_name
          },
        ],
        customData: {
          offer_id: userSale?.offer_id,
          offer_name: userSale?.task_name,
          amount: Number(userSale?.amount).toFixed(2).toString(),
          network: networkDetails.name,
          status: conversionStatus,
        },
      });
    }
    else if (postbackDataDB.status == "pending") {
      await dispatchEvent("send_user_notification", {
        templateCode: "pending_notification",
        userId: Number(currentUser?.id),
        email: currentUser?.email,
        lang: currentUser?.lang,
        models: [
          {
            task: "tasks",
            amount: Number(userSale?.amount).toFixed(2).toString(),
            network: postbackDataDB.network,
            CURRENCY: currencySymbol,
            OFFER: postbackDataDB.task_name
          },
        ],
        customData: {
          offer_id: userSale?.offer_id,
          offer_name: userSale?.task_name,
          amount: Number(userSale?.amount).toFixed(2).toString(),
          network: networkDetails.name,
          status: conversionStatus,
        },
      });
    }
    else {
      await dispatchEvent("send_user_notification", {
        templateCode: "declined_notification",
        userId: Number(currentUser?.id),
        email: currentUser?.email,
        lang: currentUser?.lang,
        models: [
          {
            task: "tasks",
            amount: Number(userSale?.amount).toFixed(2).toString(),
            network: postbackDataDB.network,
            CURRENCY: currencySymbol,
            OFFER: postbackDataDB.task_name
          },
        ],
        customData: {
          offer_id: userSale?.offer_id,
          offer_name: userSale?.task_name,
          amount: Number(userSale?.amount).toFixed(2).toString(),
          network: networkDetails.name,
          status: conversionStatus,
        },
      });
    }

    if (referralEarning) {
      await dispatchEvent("send_user_notification", {
        templateCode: "referral_notification",
        userId: Number(referralEarning.referralUser.user_id),
        email: referralEarning.referralUser.email,
        lang: referralEarning.referralUser.lang,
        models: [
          {
            USER_NAME: referralEarning.referralUser!.name,
            EARNING_AMOUNT: Number(referralEarning.referralEarning!.referral_amount).toFixed(2).toString(),
            CURRENCY: currencySymbol
          },
        ],
        customData: {
          offer_id: userSale?.offer_id,
          offer_name: userSale?.task_name,
          // @ts-ignore
          network: networkDetails.name.en ?? networkDetails.name,
          status: conversionStatus,
        },
      });
    }

    // Update Ticker
    if (postbackDataDB.status == "confirmed") {
      await postback.insertTicker(
        postbackData.uid,
        "Earnings",
        JSON.stringify({
          userName: currentUser?.name,
          offerName: userSale?.task_name,
          rewards: userSale?.amount,
          // @ts-ignore
          providerName: JSON.parse(networkDetails.name)['en'],
          type:postbackDataDB.task_type
        })
      );

    }


    // Increament Redemptions for Offer
    await postback.increaseRedemptionTask(postbackDataDB.network, postbackDataDB.offer_id);

    await postback.insertPostbackLog({
      network: postbackDataDB.network,
      transaction_id: postbackDataDB.transaction_id,
      status: "processed",
      message: null,
      payload: JSON.stringify({
        data: reqdata,
        processedData: postbackData,
        networkData: networkDetails,
        url: req.url,
        method: req.method,
        headers: req.headers,
      }),
      data: null
    })




    await dispatchEvent("track_cashback", {
      userId: Number(currentUser?.email),
      eventType: "Cashback",
      time: new Date(Date.now()),
      eventDetails: postbackDataDB
    })


    return reply.code(200).send(1);

  } catch (error: any) {
    let reqdata: PostbackReqData;

    if (req.method === 'GET') {
      reqdata = req.query as PostbackReqData;
    } else {
      reqdata = req.body as PostbackReqData;
    }

    await postback.insertPostbackLog({
      network: reqdata?.net || null,
      transaction_id: reqdata?.tid || null,
      status: "error",
      message: error ? error.toString() : "Internal Server Error",
      payload: JSON.stringify({
        data: reqdata,
        url: req.url,
        method: req.method,
        headers: req.headers,
      }),
      data: null
    })

    console.log(error);

    return reply.code(500).send(0);
  }
};
