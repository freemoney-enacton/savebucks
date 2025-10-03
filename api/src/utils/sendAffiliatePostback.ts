import { config } from "../config/config";

const baseUrl = config.env.app.conversion_api_url;
const daisyconPostbackBaseUrl = "https://0.0.4.87/d/";
const DAISYCON_CAMPAIGN_ID = "19067";

interface ConversionApiParams {
  tracking_code?: string;
  click_code?: string;
  transaction_id?: string;
  user_earning?: string;
}

interface ConversionApiResponse {
  data: any;
  status: "success" | "error";
  message: string;
}

interface DaisyconPostbackParams {
  transactionId: string;
  userId: number;
  countryCode?: string | null;
}

export async function sendConversionRequest(
  params: ConversionApiParams,
  method: "GET" | "POST" = "POST"
): Promise<ConversionApiResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params.tracking_code) {
      queryParams.append("tracking_code", params.tracking_code);
    }
    if (params.click_code) {
      queryParams.append("click_code", params.click_code);
    }
    if (params.transaction_id) {
      queryParams.append("transaction_id", params.transaction_id);
    }
    if (params.user_earning) {
      queryParams.append("user_earning", params.user_earning);
    }

    if (params.tracking_code === "user_transaction") {
      queryParams.append("status", "untracked");
    } else {
      queryParams.append("status", "pending");
    }

    const url = `${baseUrl}?${queryParams.toString()}`;

    console.log("Firing Affiliate Conversion Request", url);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      console.log("Error sending conversion request:", response.status);
    }

    const data: ConversionApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending conversion request:", error);
    throw error;
  }
}

export async function sendDaisyconPostback({
  transactionId,
  userId,
  countryCode,
}: DaisyconPostbackParams): Promise<boolean> {
  try {
    const queryParams = new URLSearchParams({
      ci: DAISYCON_CAMPAIGN_ID,
      ti: transactionId,
      dci: userId.toString(),
      pn: countryCode ? countryCode.toString().toUpperCase() : "unknown",
    });

    const url = `${daisyconPostbackBaseUrl}?${queryParams.toString()}`;
    console.log("Firing Daisycon Postback", url);

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.log("Error sending Daisycon postback:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending Daisycon postback:", error);
    return false;
  }
}
