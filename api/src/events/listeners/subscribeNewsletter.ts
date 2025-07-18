import axios from 'axios';
import { config } from '../../config/config';
import { db } from '../../database/database';


interface UserPayload {
  email: string;
  name:string
}

export const subscribeNewUser = async (payload: UserPayload) => {
  try {
    
    await addContact(payload.email, payload);

    const resultUserList=await db
        .selectFrom("settings")
        .select(['name','val'])
        .where("name","=","brevo_user_list_id")
        .executeTakeFirst()
    
    console.log("🚀 ~ subscribeNewUser ~ resultUserList:", resultUserList)
    if(!resultUserList){
        throw new Error("Unable to fetch brevo user list")
    }
        
    const apiUrl = config.env.brevo.listUrl!.replace(
      '<list_id>',
      resultUserList?.val!
    );
    console.log("🚀 ~ subscribeNewUser ~ apiUrl :", apiUrl )

    const resultKey=await db
        .selectFrom("settings")
        .select(['name','val'])
        .where("name","=","brevo_api_key")
        .executeTakeFirst()
    
    console.log("🚀 ~ subscribeNewUser ~ resultKey:", resultKey)
    if(!resultKey){
        throw new Error("Unable to fetch brevo api key")
    }

    await axios.post(
      apiUrl,
      {
        emails: [payload.email],
        attributes: {
          FNAME: payload.name,
        }
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': resultKey?.val,
          'content-type': 'application/json'
        }
      }
    );
    console.log("Newsletter event dispatched successfully")
  } catch (error) {
    console.error("Failed to subscribe user:", error);
  }
};


const addContact = async (email: string, user: UserPayload | null = null) => {
  try {
    const apiUrl = config.env.brevo.contactUrl;
    
    const params: any = {
      email: email
    };
    
    if (user) {
      params.attributes = {
        FNAME: user.name,
        }
    }
    const result=await db
        .selectFrom("settings")
        .select(['name','val'])
        .where("name","=","brevo_api_key")
        .executeTakeFirst()

    if(!result){
        throw new Error("Unable to fetch brevo api key")
    }
    await axios.post(
      apiUrl!,
      params,
      {
        headers: {
          'accept': 'application/json',
          'api-key': result?.val,
          'content-type': 'application/json'
        }
      }
    );
  
    }
  catch (error) {
        console.error("Failed to add contact:", error);
    }
};


