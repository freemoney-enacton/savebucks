import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { getNetworkDetails } from "../../postback/postback.model";
import { sluggify } from "../../../crons/functions/baseImportTask";
import { config } from "../../../config/config";
import { findUser } from "../../user/user.model";
import { db } from "../../../database/database";
import { getSetCachedData } from "../../../utils/getCached";
import app from "../../../app";

const imagePrefix = `${config.env.app.image_url}`;

export const fetchRevuOffers = async (req: FastifyRequest, reply: FastifyReply) => {

    const xClientIp = (req.headers["x-client-ip"] as string)?.trim();
    const xForwardedFor = (req.headers["x-forwarded-for"] as string)?.split(",")
        .map(ip => ip.trim())
        .find(ip => ip); // Find first non-empty IP

    const cip = xClientIp || xForwardedFor;



    const userId = req.userId as any;
    const userDetails = await findUser(userId);
    if (!userDetails) {
        return reply.sendError("User not found", 404);
    }

    // Parse query params
    const { limit, page = "1" } = req.query as { limit?: string; page?: string };
    const defaultLimit = 500;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = Number(limit) || 20;

    const net = "revu";
    const platform = [req.headers["is-app"] ?? "web"];
    const device = platform[0] === "web" ? "desktop" : platform[0];


    const network = await getNetworkDetails("tasks", net);
    if (!network) {
        return reply.sendError("Network not found", 404);
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
    const currencySymbol = parts.find((part: any) => part.type === "currency")?.value;

    try {
        // Fetch all offers from the external API
        const response = await axios.get(
            "http://publishers.revenueuniverse.com/hotoffers_api.php",
            {
                params: {
                    wall: network?.app_id,
                    uid: userId,
                    numoffers: defaultLimit,
                    version: 2,
                    ip: cip,
                    device,
                },
            }
        );

        if (response.status !== 200) {
            return reply.sendError("unable to fetch offers", 500);
        }


        const offers = response.data || [];

        if (!Array.isArray(offers) || offers.length < 0) {
            return reply.sendError("No offer available", 400)
        }

        // Pagination logic
        const totalOffers = offers.length;
        const totalPages = Math.ceil(totalOffers / pageSize);

        // Ensure page doesn't exceed max pages
        if (pageNumber > totalPages && totalOffers > 0) {
            return reply.sendError("Page not found", 404);
        }

        const start = (pageNumber - 1) * pageSize;
        const end = start + pageSize;
        const paginatedOffers = offers.slice(start, end);

        const hasNextPage = end < totalOffers;

        const revuRatio = 0.01

        // Map only the current page's offers

        const mappedResponse = paginatedOffers.map((offer: any, index: number) => {

            return {
                id: start + index + 1,
                name: offer.name,
                description: offer.description,
                instructions: offer.terms + offer.extra_terms,
                network: net,
                task_id: offer.cid,
                offer_id: `${net}_${offer.cid}`,
                category_id: null,
                image: offer.image_url,
                url: offer.offer_url,
                payout: offer.tiers && offer.currency_award_with_tiers
                    ? Number(offer.currency_award_with_tiers)
                    : (offer.currency_award),
                goal_url: offer.tiers ? offer.tiers_url : null,
                payout_type: "fixed",
                countries: null,
                platforms: platform,
                status: "publish",
                tier: null,
                is_featured: 0,
                banner_image: null,
                tracking_speed: null,
                slug: sluggify(net, offer.name, offer.cid),
                open_external_browser: network.open_task_external_browser,
                screenshot_upload: 0,
                screenshot_instructions: null,
                goals_count: null,
                goals: null,
                provider: {
                    code: network.code,
                    name: network.name,
                    icon: (network.icon?.includes('http') || !network.icon)
                        ? network.icon
                        : `${imagePrefix}/${network.icon}`,
                    logo: (network.logo?.includes('http') || !network.logo)
                        ? network.logo
                        : `${imagePrefix}/${network.logo}`,
                    render_type: network.render_type,
                },
                category: {
                    name: null,
                    id: null,
                    icon: null,
                    bg_color: null,
                    sort_order: null,
                },
                userDetails: userDetails,
                user_screenshot_upload: null,
                currency: currencySymbol,
            };
        });

        return reply.sendSuccess(
            mappedResponse,
            200,
            "revu offers fetched successfully",
            pageNumber,
            totalPages,
        );
    } catch (error: any) {
        console.error("Error fetching Revu offers:", error);
        return reply.sendError("Failed to fetch Revu offers", 500);
    }
};