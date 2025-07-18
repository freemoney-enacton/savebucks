import { sql } from "kysely";
import { db } from "../../../database/database";
import transformResponse from "../../../utils/transformResponse";

export const columns = {
    translatable: [
        "name",
        "description",
        "terms",
    ],
    money: [],
    date: []
};

export const fetch = async (lang: any, default_lang: string, country_code: string | string[] | null) => {
    const result = await db
        .selectFrom("giftcard_brands")
        .select([
            "id",
            "vendor",
            "sku",
            "name",
            "description",
            "terms",
            "image",
            "countries",
            "denomination",
            'currency'
        ])
        .$if(country_code != null, (qb) =>
            qb.where(sql<any>`
        JSON_OVERLAPS(giftcard_brands.countries, JSON_ARRAY(${country_code}))
      `)
        )
        .where("status", "=", "publish")
        .execute()

    const transformedResponse = await transformResponse(
        result,
        columns,
        default_lang,
        lang?.toString(),
        null
    );
    return transformedResponse
}

export const fetchBySku = async (lang: any, default_lang: string, sku: string) => {
    const result = await db
        .selectFrom("giftcard_brands")
        .select([
            "id",
            "vendor",
            "sku",
            "name",
            "description",
            "terms",
            "image",
            "countries",
            "denomination",
            "currency"
        ])
        .where("sku", "=", sku)
        .where("status", "=", "publish")
        .executeTakeFirst()


    if (!result) {
        throw new Error("Giftcard not found");
    }

    const safeParse = (jsonString: string | null | undefined): Record<string, any> => {
        if (!jsonString) return {};
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return {};
        }
    };

    const transformedResponse = await transformResponse(
        result,
        columns,
        default_lang,
        lang?.toString(),
        null
    );
    return transformedResponse

}