import axios from "axios";
import { config } from "../../config/config";

interface EventPayload {
  [key: string]: any;
}
export const sendEmailEvent = async (payload: any) => {
  try {
    await axios.get(`${config.env.admin.url}/send-mail-to-user`, {
      params: {
        type: payload.type,
        name: payload.name,
        email: payload.email,
        otp: payload.otp,
        user_payment_id: payload.user_payment_id,
      },
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    new Error("Failed to send email");
  }
};

export const sendSmsEvent = async (payload: any) => {
  try {
    await axios.get(
      `${config.env.admin.url}/admin/send-otp/${payload.phone_no}/${payload.otp}`
    );
  } catch (error) {
    console.error("Failed to send SMS:", error);
    new Error("Failed to send SMS");
  }
};
