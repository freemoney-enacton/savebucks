import { FastifyRequest } from "fastify";
import { getSetCachedData } from "./getCached";
import { db } from "../database/database";
import app from "../app";
import axios from "axios";
import { config } from "../config/config";

export const getIpDetails = async (clientIp: any) => {
  try {
    const fetchIp = await fetch(
      `http://ip-api.com/json/${clientIp}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
    );

    if (!fetchIp.ok) {
      console.error("Failed to fetch IP details. Status code:", fetchIp.status);
      return null;
    }

    const response = await fetchIp.json();

    return response;
  } catch (error) {
    console.error("An error occurred while fetching IP details:", error);
  }
};

export function getRequestIP(req: FastifyRequest): string {
  const xClientIp = (req.headers["x-client-ip"] as string | undefined)?.trim();
  const xForwardedFor = (req.headers["x-forwarded-for"] as string | undefined)
    ?.split(",")[0]
    ?.trim();
  console.log(xClientIp, xForwardedFor, req.ip);
  return xClientIp || xForwardedFor || req.ip;
}
export async function checkIp(req: FastifyRequest, ip: string) {
  const cacheDuration = 3600 * 24 * 7;
  const vpnSettings: any = await getSetCachedData(
    "vpn_detection",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "vpn_detection")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  if (vpnSettings.val === "0") {
    return { ip_detected: false, ip_details: null };
  }
  const response = await axios.post(
  'https://app.1lookup.io/api/v1/ip',
  { ip },
  {
    headers: {
      'Authorization': `Bearer ${config.env.app.ip_token}`,
      'Content-Type': 'application/json'
    },
    timeout: 5000
  }
);


const apiResponse = response.data;

// Validate response structure
if (!apiResponse || !apiResponse.success || !apiResponse.data) {
  console.warn("Invalid or unsuccessful IP lookup response", apiResponse);
  return null;
}

const data = apiResponse.data; // <-- This is the actual IP data object


const { risk_assessment } = data;

if (!risk_assessment) {
  console.warn("No risk_assessment in response");
  return {
    ip_detected: false,
    ip_details: data
  };
}


const isProxyDetected = Array.isArray(risk_assessment.risk_factors) &&
  risk_assessment.risk_factors.includes("PROXY_DETECTED");

return {
  ip_detected: isProxyDetected,
  ip_details: data
};
}