import { conversionStatusEnum, NewPostbackLog } from "@/db/schema";
import { createTranslation } from "@/i18n/server";
import { getClickByClickCode } from "@/models/clicks-model";
import { insertPostbackLog } from "@/models/postback-log-model";
import { commonResponse } from "@/utils/response-format";
import { NextRequest } from "next/server";

async function handleRequest(
  params: {
    tracking_code?: string;
    click_code?: string;
    transaction_id?: string;
    status?: string;
  },
  request: NextRequest
) {
  const { t } = await createTranslation();
  try {
    const { tracking_code, click_code, transaction_id, status } = params;

    const validStatuses = Object.values(conversionStatusEnum)[1];

    if (
      !validStatuses.includes(status!) ||
      status === "paid" ||
      status === undefined ||
      status === null
    ) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("conversion.invalidStatus"),
      });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const clientIP = forwarded
      ? forwarded.split(",")[0]
      : request.ip || "unknown";

    const clickRecord = (await getClickByClickCode(click_code!))?.data;

    if (!transaction_id) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("conversion.transactionIdRequired"),
      });
    }

    if (!clickRecord) {
      return commonResponse({
        data: null,
        status: "error",
        message: t("conversion.invalidClickCode"),
      });
    }

    const data: NewPostbackLog = {
      rawPostbackData: params,
      transactionId: transaction_id!,
      status: "pending",
      statusMessages: null,
      receivedAt: new Date().toISOString(),
    };

    const postback_log = await insertPostbackLog(data);

    if (postback_log.status === "error") {
      return commonResponse({
        data: postback_log,
        status: "error",
        message: t("conversion.logInsertFailed"),
      });
    }

    return commonResponse({
      data: postback_log.data,
      status: "success",
      message: "",
    });
  } catch (error) {
    console.error("Conversion record API error:", error);
    return commonResponse({
      data: null,
      status: "error",
      message: t("conversion.invalidData"),
    });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = {
    tracking_code: searchParams.get("tracking_code") || undefined,
    click_code: searchParams.get("click_code") || undefined,
    transaction_id: searchParams.get("transaction_id") || undefined,
    status: searchParams.get("status") || undefined,
  };
  return handleRequest(params, request);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = {
    tracking_code: searchParams.get("tracking_code") || undefined,
    click_code: searchParams.get("click_code") || undefined,
    transaction_id: searchParams.get("transaction_id") || undefined,
    status: searchParams.get("status") || undefined,
  };
  return handleRequest(params, request);
}
