import { sql } from "kysely";
import { db } from "../../database/database";

interface User {
    id: number;
    kyc_verified: number;
}

export const storeKycSessionIdInUser = async (sessionId: string, userId: number) => {
    await db
        .updateTable('users')
        .set({
            kyc_session_id: sessionId,
            updated_at: sql`NOW()`
        })
        .where('id', '=', userId)
        .execute();
}

export const getUserBySessionId = async (sessionId: string) => {
    return db
        .selectFrom('users')
        .select(['id', 'kyc_verified'])
        .where('kyc_session_id', '=', sessionId)
        .executeTakeFirst() || null;
}

export const storeVerificationPayload = async (userId: number, payload: any) => {
    await db
        .updateTable('users')
        .set({
            kyc_verification_payload: JSON.stringify(payload),
            kyc_verification_status: payload['status'],
            updated_at: sql`NOW()`
        })
        .where('id', '=', userId)
        .execute();
}

export const markUserKycVerified = async (userId: number) => {
    await db
        .updateTable('users')
        .set({
            kyc_verified: 1,
            kyc_verified_at: sql`NOW()`,
            updated_at: sql`NOW()`
        })
        .where('id', '=', userId)
        .execute();
};


export const getUserById = async (userId: number) => {
    return db
        .selectFrom('users')
        .select(['id', 'kyc_session_id', 'kyc_verified'])
        .where('id', '=', userId)
        .executeTakeFirst() || null;
}