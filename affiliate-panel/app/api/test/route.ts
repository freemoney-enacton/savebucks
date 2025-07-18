import { createTranslation } from "@/i18n/server";
import {
  deleteAffiliatePostback,
  getAffiliatePostbackById,
  insertAffiliatePostback,
} from "@/models/affiliate-postback-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { t } = await createTranslation();
  try {
    return commonResponse({
      data: "test",
      status: "success",
      message: "Test API is working",
    });
  } catch (error) {
    return commonResponse({
      data: error,
      status: "error",
      message: "Test API did not work",
    });
  }
}