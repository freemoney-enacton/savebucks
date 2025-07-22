import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: {
    app: {
      port: process.env.PORT,
      chat_port: process.env.CHAT_PORT,
      url: process.env.URL,
      host: process.env.HOST,
      sessionSecret: process.env.SESSION_SECRET,
      sessionSalt: process.env.SESSION_SALT,
      sessionName: process.env.SESSION_NAME,
      cookieName: process.env.COOKIE_NAME,
      staticFile: process.env.STATIC_FOLDER,
      secret: process.env.SECRET || "defaultSecret",
      expiresIn: process.env.EXPIREIN || "1d",
      appUrl: process.env.APP_URL || "",
      email: process.env.EMAIL || "example@example.com",
      recaptcha_secret: process.env.RECAPTCHA_SECRET,
      frontend_url: process.env.FRONTEND_URL || "",
      image_url: process.env.IMG_URL || "",
      onesignal_Id: process.env.ONESIGNAL_ID || "",
      onesignal_key: process.env.ONESIGNAL_KEY || "",
      otpExpiration: 10,
      domain_cookie: process.env.DOMAIN_COOKIE,
      conversion_api_url: process.env.CONVERSION_API_URL,
    },
    database: {
      port: process.env.DATABASE_PORT,
      name: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_HOST,
    },
    passport: {
      googleClientID: process.env.GOOGLE_CLIENTID || "",
      googleClientSecret: process.env.GOOGLE_SECRET || "",
      googleCallbackUrl: process.env.GOOGLE_CALLBACKURL,
      facebookClientID: process.env.FACEBOOK_CLIENTID || "",
      facebookClientSecret: process.env.FACEBOOK_SECRET || "",
      facebookCallbackUrl: process.env.FACEBOOK_CALLBACKURL || "",
      appleCallbackUrl: process.env.APPLE_CALLBACKURL || "",
      appleTeamID: process.env.APPLE_TEAMID || "",
      appleClientID: process.env.APPLE_CLIENTID || "",
      appleKeyID: process.env.APPLE_KEYID || "",
      appleKeyName: process.env.APPLE_KEY_NAME || "",
    },
    redis: {
      url: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST || "",
      password: process.env.REDIS_PASSWORD || "",
    },
    admin: {
      url: process.env.ADMIN_URL,
    },
    services: {
      kyc_didit_client_id: process.env.KYC_DIDIT_CLIENT_ID,
      kyc_didit_client_secret: process.env.KYC_DIDIT_CLIENT_SECERT,
      kyc_didit_webhook_secret: process.env.KYC_DIDIT_WEBHOOK_SECERT,
    },
    brevo: {
      listUrl: process.env.BREVO_LIST_API_URL,
      contactUrl: process.env.BREVO_CONTACT_API_URL,
    },
    translate: {
      google: process.env.GOOGLE_TRANSLATE_API_KEY,
    },
  },
};
