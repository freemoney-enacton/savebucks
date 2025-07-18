import * as OneSignal from "onesignal-node";
import { config } from "../config/config";
import { db } from "../database/database";

const oneSignalClient = new OneSignal.Client(
  config.env.app.onesignal_Id,
  config.env.app.onesignal_key
);
async function sendNotificationAndStore(
  userId: any,
  message: any,
  customData: any,
  title: any,
  url: any,
  lang:any,
  email?:any
) {
  const frontendUrl = config.env.app.frontend_url;
  // Insert into the database
  const insertResult = await db
    .insertInto("user_notifications")
    .values({
      user_id: userId,
      message: JSON.stringify(message),
      meta_data: JSON.stringify(customData),
      onesignal_response: null,
      route: `${url}`,
    })
    .execute();

  // Send notification via OneSignal
  let contents=title
  if(lang !=null || lang != undefined){
    contents['en']=contents[lang]
  }

  let finalUrl;
  if (url.includes('chat')) {
    finalUrl = `${frontendUrl}/?${url}`;
  } else {
    finalUrl = `${frontendUrl}${url}`;
  }
  
  const notificationPayload = {
    include_external_user_ids: [`${email ?? userId}`],
    contents: contents,
    data: customData,
    url:finalUrl,
    channel_for_external_user_ids: "push",
  };

  try {
    const response = await oneSignalClient.createNotification(
      notificationPayload
    );
    await db
      .updateTable("user_notifications")
      .set({
        onesignal_response: JSON.stringify(response),
      })
      .where("id", "=", Number(insertResult[0].insertId))
      .execute();
  } catch (error: any) {
    await db
      .updateTable("user_notifications")
      .set({
        onesignal_response: JSON.stringify({ error: error }),
      })
      .where("id", "=", Number(insertResult[0].insertId))
      .execute();
     
      
  }
}

export async function sendTemplateNotification(payload: any) {
  // Query the database for the template
  const template: any = await db
    .selectFrom("notification_templates")
    .selectAll()
    .where("template_code", "=", payload.templateCode)
    .executeTakeFirst();

  if (!template) {
    console.error(
      "No template found for the given code:",
      payload.templateCode
    );
    return;
  }
  let titles = template.title; // Assuming titles are stored as JSON

  let descriptions = template.description; // Assuming descriptions are stored as JSON


  // Replace macros in the template
  payload.models.forEach((model: any) => {
    for (const key in model) {
      Object.keys(titles).forEach((lang) => {
        titles[lang] = titles[lang].replace(
          new RegExp(`#${key}`, "g"),
          model[key]
        );
      });
      Object.keys(descriptions).forEach((lang) => {
        descriptions[lang] = descriptions[lang].replace(
          new RegExp(`#${key}`, "g"),
          model[key]
        );
      });
    }
  });


  // Send notification with all language data
  try {
    const messages: any = {};
    Object.keys(titles).forEach((lang) => {
      messages[lang] = JSON.stringify({
        title: titles[lang],
        description: descriptions[lang],
      });
    });
    await sendNotificationAndStore(
      payload.userId,
      messages,
      payload.customData,
      titles,
      template.route,
      payload.lang,
      payload.email
    );
    //console.log("Notification sent successfully to user:", payload.userId);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
