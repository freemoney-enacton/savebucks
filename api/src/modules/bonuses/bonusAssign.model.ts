import { db } from "../../database/database"

export const fetch = async (
    user_Id:number,
    code:string
)=>{
    const result=await db
        .selectFrom("user_bonus")
        .selectAll()
        .where("user_id","=",user_Id)
        .where("bonus_code","=",code)
        .executeTakeFirst()

    return result
}