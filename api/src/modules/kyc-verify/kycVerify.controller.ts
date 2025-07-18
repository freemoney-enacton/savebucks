import * as kycVerifyModel from "./kycVerify.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { createHmac, timingSafeEqual } from "crypto";
import app from "../../app";

export const columns = {
    translatable: ["val", "meta_title", "meta_desc"],
    // hidden: ["ID", "status", "category_id"],
    money: [],
    date: [],
};

import { config } from "../../config/config";

export const getKycVerificationSession = async (req: FastifyRequest, reply: FastifyReply) => {
    const user: any = req.user;

    const { redirect_url } = req.body as {
        redirect_url?: string;
    };

    console.log({ id: config.env.services.kyc_didit_client_id, sec: config.env.services.kyc_didit_client_secret })

    const accessToken = await getDiditAccessToken();
    console.log("🚀 ~ getKycVerificationSession ~ accessToken:", accessToken)

    if (!redirect_url) {
        return reply.sendError(
            app.polyglot
                .t("error.kycVerification.redirectUrlRequired"),
            400
        );
    }

    const sessionResp = await createDiditSession(accessToken, redirect_url, 'test');
    console.log("🚀 ~ getKycVerificationSession ~ sessionResp:", sessionResp)

    //   const sessionUrl = 'https://verify.didit.me/session/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzQzNDYyNDUsImV4cCI6MTczNDk1MTA0NSwic2Vzc2lvbl9pZCI6ImUxMzNhNWQwLTlmMWEtNDBmYi1hNzQ5LWVjODc1YWUzMzUwNSJ9.Bpt3HccDoX593VEFMIJ24ASw84luT3E7Ze-dRiCRTU8?step=start';

    if(!sessionResp || !sessionResp.session_id || !sessionResp.url) {
        return reply.sendError(
            app.polyglot
                .t("error.kycVerification.kycVerificationFailedToCreateSession"),
            400
        );
    }

    await kycVerifyModel.storeKycSessionIdInUser(sessionResp.session_id, Number(user.id));

    const sessionUrl = sessionResp.url;

    // If no group is specified, return all data
    return reply.sendSuccess(
        {
            session_url: sessionUrl,
            redirect_url: redirect_url
        },
        200,
        "null",
        null,
        null
    );

};

async function getDiditAccessToken() {
    const url = 'https://apx.didit.me/auth/v2/token/';
    const clientID = config.env.services.kyc_didit_client_id;
    const clientSecret = config.env.services.kyc_didit_client_secret;

    if (!clientID || !clientSecret) {
        console.error('Missing Client ID or Client Secret in configuration.');
        return null;
    }

    const encodedCredentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const responseData: any = await response.json();
        console.log("🚀 ~ getDiditAccessToken ~ responseData:", responseData)

        if (response.ok) {
            return responseData?.access_token;
        } else {
            console.error('Error fetching access token:', responseData);
            return null;
        }
    } catch (error) {
        console.error('Network error while fetching access token:', error);
        return null;
    }
}

async function createDiditSession(accessToken: string, callback: string, vendorData: string) {
    const url = 'https://verification.didit.me/v1/session/';

    if (!accessToken) {
        console.error('Unable to obtain access token. Session creation aborted.');
        return null;
    }

    const body = {
        callback: callback,
        vendor_data: vendorData,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            console.error('Error creating session:', responseData);
            return null;
        }
    } catch (error) {
        console.error('Network error while creating session:', error);
        return null;
    }
}

function verifyWebhookSignature(
    requestBody: string,
    signature: string,
    timestamp: number,
    secretKey: string
): boolean {
    // Check if timestamp is recent (within 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - timestamp) > 300) {
        return false;
    }

    // Calculate expected signature
    const expectedSignature = createHmac("sha256", secretKey)
        .update(requestBody)
        .digest("hex");

    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
    const providedSignatureBuffer = Buffer.from(signature, 'hex');

    // Compare signatures
    return expectedSignatureBuffer.length === providedSignatureBuffer.length &&
        timingSafeEqual(expectedSignatureBuffer, providedSignatureBuffer);
}


export const processKycVerificationWebhook = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const rawBody = JSON.stringify(req.body);
        const signature = req.headers["x-signature"] as string;
        const timestamp = req.headers["x-timestamp"] as string;
        const webhookSecret = config.env.services.kyc_didit_webhook_secret;

        // Verify webhook signature
        if (!signature || !timestamp || !webhookSecret) {
            return reply.code(401).send({
                success: false,
                message: app.polyglot.t("error.kycVerification.unauthorized")
            });
        }

        const isValid = verifyWebhookSignature(
            rawBody,
            signature,
            parseInt(timestamp),
            webhookSecret
        );

        if (!isValid) {
            return reply.code(401).send({
                success: false,
                message: app.polyglot.t("error.kycVerification.invalidWebhookSignature")
            });
        }

        const payload = req.body as {
            session_id: string;
            status: string;
            vendor_data?: string;
        };

        // Find user by session ID
        const user = await kycVerifyModel.getUserBySessionId(payload.session_id);
        
        if (!user) {
            return reply.sendError(
                app.polyglot.t("error.kycVerification.userNotFound"),
                404
            );
        }

        // Store verification payload
        await kycVerifyModel.storeVerificationPayload(user.id, payload);

        // Update KYC verification status if approved
        if (payload.status === 'Approved') {
            await kycVerifyModel.markUserKycVerified(user.id);
        }

        return reply.sendSuccess(
            {
                status: payload.status,
                session_id: payload.session_id
            },
            200,
            "null",
            null,
            null
        );

    } catch (error) {
        console.error('Error processing KYC webhook:', error);
        return reply.sendError(
            app.polyglot.t("error.kycVerification.webhookProcessingFailed"),
            500
        );
    }
};



async function getSessionDecision(sessionId: string, accessToken: string) {
    const url = `https://verification.didit.me/v1/session/${sessionId}/decision/`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });

        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            console.error('Error fetching session decision:', responseData);
            return null;
        }
    } catch (error) {
        console.error('Network error while fetching session decision:', error);
        return null;
    }
}

export const checkKycVerificationStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    const user: any = req.user;

    try {
        // Get user's kyc session ID
        const userData = await kycVerifyModel.getUserById(user.id);
        
        if (!userData?.kyc_session_id) {
            return reply.sendError(
                app.polyglot.t("error.kycVerification.noKycSessionFound"),
                400
            );
        }

        // Get access token (reusing existing function)
        const accessToken = await getDiditAccessToken();
        if (!accessToken) {
            return reply.sendError(
                app.polyglot.t("error.kycVerification.authenticationFailed"),
                500
            );
        }

        // Get session decision
        const decision = await getSessionDecision(userData.kyc_session_id, accessToken);
        console.log(decision);
        if (!decision) {
            return reply.sendError(
                app.polyglot.t("error.kycVerification.failedToFetchKycStatus"),
                500
            );
        }

        // Store decision in user record (reusing existing function)
        await kycVerifyModel.storeVerificationPayload(user.id, decision);

        // Update KYC verification status if approved
        if (decision.status === 'Approved') {
            await kycVerifyModel.markUserKycVerified(user.id);
        }

        return reply.sendSuccess(
            {
                is_verified: decision.status === 'Approved',
                status: decision.status
            },
            200,
            "null",
            null,
            null
        );

    } catch (error) {
        console.error('Error checking KYC status:', error);
        return reply.sendError(
            app.polyglot.t("error.kycVerification.kycStatusCheckFailed"),
            500
        );
    }
};