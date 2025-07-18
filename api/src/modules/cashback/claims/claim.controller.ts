import { abort } from "process";
import app from "../../../app";
import { db } from "../../../database/database";
import { getSetCachedData } from "../../../utils/getCached";
import { StoreCashback } from "../../stores/store.model";
import { currencyTransform } from "./../../../utils/transformResponse";
import * as claim from "./claim.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { ClaimRequestBody, requestClaimSchema } from "./claim.schema";
import * as click from "../clicks/clicks.model"
import { Clicks } from "../../../../db";

import fs from 'fs';
import { MultipartFile, MultipartValue } from "@fastify/multipart";
import path from "path";
import { moveUploadedFile } from "../../../utils/ImageUpload";
import { config } from "../../../config/config";

type MultipartFieldValue = {
  value: string;
  mimetype: string;
  filename: string;
};

type MultipartFields = {
  [fieldname: string]: MultipartFieldValue;
};

// Use this type in your controller
type MultipartData = {
  file: NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  fields?: MultipartFields;
  fieldname: string;
};

export const list = async (req: FastifyRequest, reply: FastifyReply) => {
  const { month_year, page, limit, status } = req.query as {
    status: "open" | "hold" | "answered" | "closed" | null;
    month_year: string | null;
    limit: string | null;
    page: string | undefined;
  };
  const lang = req.headers["x-language"];
  const result = await claim.lists(
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
      result.claims,
      200,
      "Fetched SuccessFull",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};



export const dateFormat = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await claim.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};


export const getClaimableClicks=async(req:FastifyRequest,reply:FastifyReply)=>{
  //console.log(req.userEmail)
  const {storeid}=req.params as {storeid:string}
  const userExists=await claim.userExists(req.userEmail)
  if(!userExists){
    return reply.sendError(app.polyglot.t("error.user.invalidUser"), 404);
  }
  const store=await db.selectFrom("stores")
      .selectAll()
      .where("stores.id",'=',parseInt(storeid))
      .executeTakeFirst()

    if(!store){
      return reply.sendError(app.polyglot.t("error.cashback.storeNotFound"), 404);
    }


  //claim validity period config (1-10 days)
  const minDate = new Date(Date.now()- 86400 * 1000 * 3); //change to one day
  const maxDate = new Date(Date.now() - 86400 * 1000 * 15);  

  const result =await claim.claimableClicks(userExists.id,store.id,minDate,maxDate)


  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
}

export const getStoreWithClaimableClicks=async(req:FastifyRequest,reply:FastifyReply)=>{
  const lang=req.headers["x-language"]
  //@ts-ignore
  const fallback_lang:any=JSON.parse(await app.redis.get("fallback_lang"))
  const userExists=await claim.userExists(req.userEmail)
  if(!userExists){
    return reply.sendError(app.polyglot.t("error.user.invalidUser"), 404);
  }


  //claim validity period config (1-10 days)
  const minDate = new Date(Date.now()- 86400 * 1000 * 3); 
  const maxDate = new Date(Date.now() - 86400 * 1000 * 15);  

  const result =await claim.storesWithClaimableClicks(userExists.id,minDate,maxDate,lang,fallback_lang?.val)

  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
}



export const insertClaim =async(req:FastifyRequest,reply:FastifyReply)=>{  
  try {
    console.log(req.body)
  const file = (req as any).file;
    if (!file) {
      return reply.sendError(app.polyglot.t("error.images.imageNotFound"), 400);
    }
    
    // Access form fields from req.body
    const { 
      store_id, 
      click_id, 
      platform, 
      order_id, 
      order_amount, 
      currency, 
      transaction_date, 
      user_message 
    } = req.body as any;
    
    const tempFilePath = file.path;
    const finalPath = await moveUploadedFile(tempFilePath, 'uploads/claims');   
    
    const receipt = {
      filename: file.filename,
      path: finalPath,
      url: `${config.env.app.appUrl}/${path.basename('uploads')}/claims/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    };
    if(!receipt){
      return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
    }

    const user=await claim.userExists(req.userEmail)
    if(!user){
      if (receipt && receipt.path && fs.existsSync(receipt.path)) {
        fs.unlinkSync(receipt.path);
      }
      return reply.sendError(app.polyglot.t("error.user.invalidUser"), 404);
    }
  
    const claimExists=await claim.getClaim(parseInt(click_id),parseInt(req.userId))
    if(claimExists){
      if (receipt && receipt.path && fs.existsSync(receipt.path)) {
        fs.unlinkSync(receipt.path);
      }
      return reply.sendError(app.polyglot.t("error.cashback.claimExists"), 404);
    }

    const store=await db.selectFrom("stores")
      .selectAll()
      .where("stores.id",'=',parseInt(store_id))
      .executeTakeFirst()

    if(!store){
      if (receipt && receipt.path && fs.existsSync(receipt.path)) {
        fs.unlinkSync(receipt.path);
      }
      return reply.sendError(app.polyglot.t("error.cashback.storeNotFound"), 404);
    }

    const clicks:any =await click.getClickById(parseInt(click_id))
    if(!clicks){
      if (receipt && receipt.path && fs.existsSync(receipt.path)) {
        fs.unlinkSync(receipt.path);
      }
      return reply.sendError(app.polyglot.t("error.images.imageNotFound"), 404);
    }
    const minDate = new Date(`${clicks?.click_time}`); 
    const maxDate = new Date(Date.now()); 
    //console.log(minDate, " ~ ",maxDate)


    const transactionDate = convertToIsoDate(transaction_date);
    if (transactionDate <= minDate || transactionDate >= maxDate) {
      if (receipt && receipt.path && fs.existsSync(receipt.path)) {
        fs.unlinkSync(receipt.path);
      }
      return reply.sendError(app.polyglot.t("error.cashback.rangeExceeded"),400);
    }
    //console.log(transactionDate)
    //must check for order id also
    
    //insert claims
    await claim.insertClaim(clicks?.id,clicks?.code,currency,clicks?.click_time,clicks?.network_id,clicks?.network_campaign_id,parseInt(order_amount),order_id,platform,receipt?.url,store_id,transactionDate,user.id,user_message)
    
    const claims=await claim.getClaim(click_id,parseInt(req.userId))
    return reply.sendSuccess(claims,200,"Claim Inserted Successfully",null,null)
  } catch (error) {
    console.error("unexpected error",error)
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
 
};

function convertToIsoDate(inputDate:string, time = '00:00:00') {
  // Check if the input is in the expected dd/mm/yyyy format
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = inputDate.match(dateRegex);
  
  if (!match) {
    throw new Error(`Invalid date format. Expected dd/mm/yyyy, got: ${inputDate}`);
  }
  
  // Destructure the matched groups
  const [, day, month, year] = match;
  
  // Create a Date object with explicit time
  const [hours = 0, minutes = 0, seconds = 0] = time.split(':').map(Number);
  
  const parsedDate = new Date(
    parseInt(year), 
    parseInt(month) - 1, 
    parseInt(day),
    hours,
    minutes,
    seconds
  );
  
  // Validate the date to catch invalid dates like 31/02/2023
  if (
    parsedDate.getFullYear() !== parseInt(year) ||
    parsedDate.getMonth() !== parseInt(month) - 1 ||
    parsedDate.getDate() !== parseInt(day)
  ) {
    throw new Error(`Invalid date: ${inputDate}`);
  }
  
  return parsedDate;
}






