import { FastifyReply, FastifyRequest } from "fastify";
import { bonusDetails } from "../user-bonuses/bonuses.model";
import { referCodeUser } from "../user/user.model";
import app from "../../app";
import { handleBonusAndNotifications } from "../../utils/bonusHandle";
import * as bonusAssign from "./bonusAssign.model"


export const assign =async (req:FastifyRequest,reply:FastifyReply)=>{
    const {code}=req.params as {code:string}
    if(code!="app_install"){
        reply.sendError(app.polyglot.t("error.bonuses.bonus_code.not_yet_available"),400)
    }
    let bonus = await bonusDetails(code);    
    
    const bonusAssignedAlready=await bonusAssign.fetch(Number(req.userId),code)

    if(bonusAssignedAlready){
        return reply.sendError(
            app.polyglot.t("error.bonuses.bonus_code.claimed"),
            400
        )
    }
    
    await handleBonusAndNotifications(
    Number(req.userId),
    bonus,
    );
    return reply.sendSuccess(
    bonus,
    201,
    "Bonus Inserted Successfully",
    null,
    null
    );
}