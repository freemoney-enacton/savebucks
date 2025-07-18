import { assignBonus } from "./listeners/assignBonus";
import { sendEmailEvent, sendSmsEvent } from "./listeners/sendWelcomeEmail";
import { sendActivitiesNotification } from "../utils/sendUserActivities";
import { sendTemplateNotification } from "../utils/sendNotifications";
import { subscribeNewUser } from "./listeners/subscribeNewsletter";
import { trackCashback } from "./listeners/trackCashback";


export const eventListeners: any = {
  send_email: [sendEmailEvent],
  send_sms: [sendSmsEvent],
  assign_bonus: [assignBonus],
  send_user_activity: [sendActivitiesNotification],
  send_user_notification: [sendTemplateNotification],
  subscribe_new_user: [subscribeNewUser],
  track_cashback:[trackCashback]
};
