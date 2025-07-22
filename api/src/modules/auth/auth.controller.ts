import * as auth from "./auth.model";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { createJWTToken, decodeToken } from "./jwt";
import { config } from "../../config/config";
import {
  forgotPasswordBodySchema,
  loginBodySchema,
  registerUserSchemas,
} from "./auth.schema";
import { bonusDetails } from "../user-bonuses/bonuses.model";
import {
  findUser,
  referCodeUser,
  updateEmailPhone,
  updateUser,
} from "../user/user.model";
import { dispatchEvent } from "../../events/eventBus";
import { getIpDetails } from "../../utils/getClientInfo";
import { handleBonusAndNotifications } from "../../utils/bonusHandle";
import app from "../../app";
import { db } from "../../database/database";
import { sendConversionRequest } from "../../utils/sendAffiliatePostback";
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password, referral } = req.body as registerUserSchemas;
  // @ts-ignore
  const response_key: any = req.body["recaptcha"];
  // @ts-ignore
  // const secret_key = config.env.app.recaptcha_secret;
  // const verifyEndpoint = "https://www.google.com/recaptcha/api/siteverify";
  // const captchaResponse = await fetch(verifyEndpoint, {
  //   method: "POST",
  //   headers: { "Content-type": "application/x-www-form-urlencoded" },
  //   body: new URLSearchParams({
  //     secret: secret_key as string,
  //     response: response_key,
  //   }),
  // }).then((res) => res.json());
  // if (!captchaResponse.success) {
  //   return reply.sendError(app.polyglot.t("error.auth.captchaResponse"), 498);
  // }

  const disposal: any = await fetch(
    `https://disposable.debounce.io/?email=${email}`
  );
  const isDisposal = await disposal.json();
  if (isDisposal.disposable === "true") {
    return reply.sendError(app.polyglot.t("error.auth.disposableEmail"), 409);
  }

  const userBanned = await auth.check(email);
  if (userBanned) {
    return reply.sendError(app.polyglot.t("error.auth.userBanned"), 409);
  }

  const userExist = await auth.login(email);
  if (userExist) {
    return reply.sendError(app.polyglot.t("error.auth.userExist"), 409);
  }

  let referredBy = null;
  if (referral) {
    referredBy = await referCodeUser(referral);
    if (!referredBy) {
      return reply.sendError(
        app.polyglot.t("error.auth.invalidReferralCode"),
        409
      );
    }
  }
  const hashPassword: string = await bcrypt.hash(password, 10);
  const referralCode = (Math.random() + 1).toString(36).substring(7);
  const device_id: any = req.cookies.device_id;
  const country_code =
    req.headers["x-country"] ?? req.headers["cf-ipcountry"] ?? "unknown";
  const client_ip =
    req.headers["x-client-ip"] ?? req.headers["cf-connecting-ip"];
  const clientInfo = await getIpDetails(client_ip);
  // const lang = req.headers["x-language"]? req.headers["x-language"]  : "en";
  // console.log(req.headers["x-language"])
  // console.log(lang)

  const metaData = {
    ...clientInfo,
    userAgent: req.headers["user-agent"],
    referrer: req.headers.referer,
    route: req.routeOptions.url,
  };
  const register: any = await auth.register(
    name,
    email,
    hashPassword,
    referralCode,
    referral ? referral : null,
    JSON.stringify(metaData),
    client_ip,
    device_id,
    country_code,
    clientInfo.timezone ?? "unknown",
    "email"
  );

  if (!register) {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }

  let accessToken = await createJWTToken(
    { name: name, email: email, id: Number(register.insertId) },
    `${parseInt(config.env.app.expiresIn)}h`
  );

  reply.setCookie("token", accessToken.toString(), {
    path: "/",
    domain: config.env.app.domain_cookie,
  });
  await auth.insertAuthLogs(
    register.insertId,
    client_ip,
    device_id,
    JSON.stringify(metaData)
  );

  // Handle bonuses and notifications
  let joinBonus = await bonusDetails("join_no_refer");
  const joinWithRefer = await bonusDetails("join_with_refer");
  if (referredBy && joinWithRefer && joinWithRefer !== undefined) {
    joinBonus = joinWithRefer;
  }

  await handleBonusAndNotifications(
    Number(register.insertId),
    joinBonus,
    referredBy
  );
  let joinBonusAmount = joinBonus ? joinBonus.amount : 0;
  let userDetails = { token: accessToken, join_bonus: joinBonusAmount };
  return reply.sendSuccess(
    userDetails,
    201,
    "Registered successfully!",
    null,
    null
  );
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as loginBodySchema;
  // @ts-ignore
  const response_key: any = req.body["recaptcha"];
  // Put secret key here, which we get from google console
  const secret_key = config.env.app.recaptcha_secret;
  const verifyEndpoint = "https://www.google.com/recaptcha/api/siteverify";
  const captchaResponse = await fetch(verifyEndpoint, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: secret_key as string,
      response: response_key,
    }),
  }).then((res) => res.json());
  // if (!captchaResponse.success) {
  //   return reply.sendError(app.polyglot.t("error.auth.captchaResponse"), 498);
  // }
  const device_id: any = req.cookies.device_id;
  const clientInfo = await getIpDetails(req.ip);
  const metaData = {
    ...clientInfo,
    userAgent: req.headers["user-agent"],
    referrer: req.headers.referer,
  };
  const userData = await auth.login(email);
  if (userData?.status === "banned") {
    return reply.sendError(app.polyglot.t("error.auth.userBanned"), 401);
  }
  if (!userData) {
    return reply.sendError(app.polyglot.t("error.auth.userNotFound"), 404);
  } else {
    if (userData.provider_type === "email" && userData.password === null) {
      return reply.sendError(app.polyglot.t("error.auth.resetPassword"), 404);
    }
    if (userData.password === null) {
      return reply.sendError(app.polyglot.t("error.auth.loginSocial"), 401);
    }
    const isValidPassord = await bcrypt.compare(password, userData.password);
    if (!isValidPassord) {
      return reply.sendError(app.polyglot.t("error.auth.invalidPassword"), 401);
    } else {
      let checkSession = req.cookies.token;
      if (checkSession !== undefined) {
        return reply.redirect(`/dashboard?token=${checkSession}`);
      } else {
        let newAccessToken = await createJWTToken(
          { name: userData.name, email: userData.email, id: userData.id },
          `${parseInt(config.env.app.expiresIn)}h`
        );
        reply.setCookie("token", newAccessToken.toString(), {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        const client_ip =
          req.headers["x-client-ip"] ?? req.headers["cf-connecting-ip"];
        await auth.insertAuthLogs(
          userData.id,
          client_ip,
          device_id,
          JSON.stringify({
            ...metaData,
            route: req.routeOptions.url,
          })
        );
        return reply.sendSuccess(
          { token: newAccessToken },
          200,
          "Logged in successfully",
          null,
          null
        );
      }
    }
  }
};

export const verifyUser = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { email, phone_no, otp } = req.body as {
    email: any;
    phone_no: any;
    otp: number;
  };
  const userDetails = await findUser(Number(req.userId));
  if (!email && !otp && !phone_no) {
    return reply.sendError(
      app.polyglot.t("error.auth.emailPhoneOtpRequired"),
      400
    );
  }
  if (email != undefined || email != null) {
    const otpVerified = await auth.verifyOtp(email, null, otp);
    if (!otpVerified) {
      return reply.sendError(app.polyglot.t("error.auth.invalidOtp"), 401);
    }
    if (otpVerified?.expiration < new Date()) {
      return reply.sendError(app.polyglot.t("error.auth.expiredOtp"), 401);
    } else {
      const user = await auth.login(email);
      if (userDetails?.is_email_verified == 0) {
        await updateEmailPhone(Number(req.userId), email, undefined);
        await auth.updateIsVerified(email);
        dispatchEvent("send_email", {
          type: "welcome",
          name: user?.name,
          email: email,
          otp: otp,
        });
        dispatchEvent("subscribe_new_user", {
          name: user?.name,
          email: email,
        });
        const userInfo = await auth.login(email);
        let accessToken = await createJWTToken(
          {
            name: userInfo?.name,
            email: userInfo?.email,
            id: Number(userDetails.id),
          },
          `${parseInt(config.env.app.expiresIn)}h`
        );
        reply.setCookie("token", accessToken.toString(), {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        if (user) {
          const userData = await db
            .selectFrom("users")
            .select(["affiliate_click_code"])
            .where("id", "=", user.id)
            .executeTakeFirst();

          console.log("User Data from verify_email", userData);

          if (userData && userData.affiliate_click_code) {
            console.log(
              "Firing Affiliate Conversion Request after verify_email",
              "register"
            );
            const res = await sendConversionRequest({
              tracking_code: "register",
              click_code: userData?.affiliate_click_code,
              transaction_id: user.id.toString(),
            });
          }
        }
        return reply.sendSuccess(
          { ...userInfo, token: accessToken },
          200,
          "Your email is successfully verified",
          null,
          null
        );
      } else {
        return reply.sendError(app.polyglot.t("error.auth.verifiedEmail"), 409);
      }
    }
  }

  if (phone_no != undefined || phone_no != null) {
    const otpVerified = await auth.verifyOtp(null, phone_no, otp);
    if (!otpVerified) {
      return reply.sendError(app.polyglot.t("error.auth.invalidOtp"), 401);
    }
    if (otpVerified?.expiration < new Date()) {
      return reply.sendError(app.polyglot.t("error.auth.expiredOtp"), 401);
    } else {
      const user = await auth.findByPhone(phone_no);
      if (userDetails?.is_phone_no_verified == 0) {
        await updateEmailPhone(Number(req.userId), undefined, phone_no);
        await auth.updatePhoneVerified(phone_no);
        const user = await auth.findByPhone(phone_no);
        let accessToken = await createJWTToken(
          { name: user?.name, email: user?.email, id: Number(user?.id) },
          `${parseInt(config.env.app.expiresIn)}h`
        );
        reply.setCookie("token", accessToken.toString(), {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        return reply.sendSuccess(
          { ...user, token: accessToken },
          200,
          "Your Phone Number is successfully verified",
          null,
          null
        );
      } else {
        return reply.sendError(app.polyglot.t("error.auth.verifiedPhone"), 409);
      }
    }
  }
};
export const forgotPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const otp = generateOtp();
  const { email } = req.body as forgotPasswordBodySchema;
  // @ts-ignore
  const response_key: any = req.body["recaptcha"];
  // Put secret key here, which we get from google console
  const secret_key = process.env.RECAPTCHA_SECRET;

  const verifyEndpoint = "https://www.google.com/recaptcha/api/siteverify";
  const captchaResponse = await fetch(verifyEndpoint, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: secret_key as string,
      response: response_key,
    }),
  }).then((res) => res.json());
  if (!captchaResponse.success) {
    reply.send(app.polyglot.t("error.auth.captchaResponse"));
  }
  const user = await auth.login(email);
  console.log("forgotPassword");
  console.log("user", user);
  if (!user) {
    console.log("if not user", user);
    return reply.sendError(app.polyglot.t("error.auth.userNotFound"), 404);
  } else {
    if (user.provider_type === "email") {
      console.log("if provider_type email");
      await auth.storeOtp(email, null, otp);
      dispatchEvent("send_email", {
        type: "forgot",
        name: user.name,
        email: email,
        otp: otp,
      });
      return reply.sendSuccess("", 200, "Otp sent to your email", null, null);
    } else if (user.password == null) {
      console.log("if provider_type not email");
      return reply.sendError(app.polyglot.t("error.auth.loginSocial"), 401);
    } else {
      console.log("if not registered");
      return reply.sendError(app.polyglot.t("error.auth.registerRequest"), 401);
    }
  }
};
export const resetPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };
  // @ts-ignore
  const response_key: any = req.body["recaptcha"];
  // Put secret key here, which we get from google console
  const secret_key = config.env.app.recaptcha_secret;

  const verifyEndpoint = "https://www.google.com/recaptcha/api/siteverify";
  const captchaResponse = await fetch(verifyEndpoint, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: secret_key as string,
      response: response_key,
    }),
  }).then((res) => res.json());

  if (!captchaResponse.success) {
    reply.send(app.polyglot.t("error.auth.captchaResponse"));
  }

  const isEmail = await auth.login(email);
  if (!isEmail) {
    return reply.sendError(app.polyglot.t("error.auth.invalidEmail"), 401);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await auth.updatePassword(email, hashedPassword);
    return reply.sendSuccess("", 200, "Password reset successful", null, null);
  }
};
export const changePassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  let email = req.userEmail;
  const { currentPassword, password } = req.body as {
    currentPassword: string;
    password: string;
  };
  const currentHashPassword: string = await bcrypt.hash(currentPassword, 10);
  if (!currentPassword || !password) {
    return reply.sendError(
      app.polyglot.t("error.auth.currentNewPasswordReq"),
      400
    );
  }
  if (currentPassword === password) {
    return reply.sendError(
      app.polyglot.t("error.auth.newPasswordMustDiffer"),
      400
    );
  }
  if (email) {
    const user = await auth.login(email);
    if (!user) {
      return reply.sendError(app.polyglot.t("error.auth.userNotFound"), 404);
    } else {
      if (user.password === null) {
        return reply.sendError(
          app.polyglot
            .t("error.auth.passwordChangeNotAllowed")
            .replace("#PROVIDER_TYPE", user.provider_type),
          401
        );
      }
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!validPassword) {
        return reply.sendError(
          app.polyglot.t("error.auth.currentPasswordIncorrect"),
          401
        );
      } else {
        const hashedNewPassword = await bcrypt.hash(password, 10);
        await auth.updatePassword(email, hashedNewPassword);
        return reply.sendSuccess(
          null,
          200,
          "Password reset successful",
          null,
          null
        );
      }
    }
  } else {
    return reply.sendError(app.polyglot.t("error.auth.loginRequest"), 404);
  }
};
export const logout = (req: FastifyRequest, reply: FastifyReply) => {
  try {
    req.logout();
    reply.clearCookie("token", {
      path: "/",
      domain: config.env.app.domain_cookie,
    });
    req.session.delete();
    return reply.sendSuccess(null, 200, "Logout Successful", null, null);
  } catch (error: any) {
    return reply.sendError(error?.message + "From Server", 500);
  }
};

export const sendOtp = async (req: FastifyRequest, reply: FastifyReply) => {
  const { phone_no, email } = req.body as { email: any; phone_no: any };
  const otp = generateOtp();
  if (email) {
    const disposal: any = await fetch(
      `https://disposable.debounce.io/?email=${email}`
    );
    const isDisposal = await disposal.json();
    if (isDisposal.disposable === "true") {
      return reply.sendError(app.polyglot.t("error.auth.disposableEmail"), 409);
    }
    await auth.storeOtp(email, null, otp);
    dispatchEvent("send_email", {
      type: "verify",
      email: email,
      otp: otp,
    });
    return reply.sendSuccess(null, 200, `Otp sent to ${email}`, null, null);
  }
  if (phone_no) {
    await auth.storeOtp(null, phone_no, otp);
    dispatchEvent("send_sms", {
      phone_no: phone_no.replace(/\s+/g, ""),
      otp: otp,
    });
    return reply.sendSuccess(null, 200, `Otp sent to ${phone_no}`, null, null);
  }
  return reply.sendError(app.polyglot.t("error.auth.emailPhoneRequired"), 400);
};

export const sendVerificationOtp = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { phone_no, email } = req.body as { email: any; phone_no: any };
  if (!email && !phone_no) {
    return reply.sendError(
      app.polyglot.t("error.auth.emailPhoneRequired"),
      400
    );
  }
  const otp = generateOtp();
  if (email) {
    const userExist = await auth.login(email);
    if (!userExist) {
      const disposal: any = await fetch(
        `https://disposable.debounce.io/?email=${email}`
      );
      const isDisposal = await disposal.json();
      if (isDisposal.disposable === "true") {
        return reply.sendError(
          app.polyglot.t("error.auth.disposableEmail"),
          409
        );
      }
      await auth.storeOtp(email, null, otp);
      dispatchEvent("send_email", {
        type: "verify",
        email: email,
        otp: otp,
      });
      return reply.sendSuccess(null, 200, `Otp sent to ${email}`, null, null);
    } else {
      if (userExist?.id != Number(req.userId)) {
        return reply.sendError(app.polyglot.t("error.auth.emailExist"), 409);
      }
      const disposal: any = await fetch(
        `https://disposable.debounce.io/?email=${email}`
      );
      const isDisposal = await disposal.json();
      if (isDisposal.disposable === "true") {
        return reply.sendError(
          app.polyglot.t("error.auth.disposableEmail"),
          409
        );
      }
      await auth.storeOtp(email, null, otp);
      dispatchEvent("send_email", {
        type: "verify",
        email: email,
        otp: otp,
      });
      return reply.sendSuccess(null, 200, `Otp sent to ${email}`, null, null);
    }
  }
  if (phone_no != null || phone_no != undefined || phone_no) {
    const userExist = await auth.findByPhone(phone_no);
    if (userExist) {
      return reply.sendError(
        app.polyglot.t("error.auth.phoneNumberExist"),
        409
      );
    } else {
      await db
        .updateTable("users")
        .set({ phone_no: phone_no, is_phone_no_verified: 1 })
        .where("id", "=", Number(req.userId))
        .execute();

      return reply.sendSuccess(
        null,
        200,
        `Phone number successfully updated`,
        null,
        null
      );
    }
  }
};

export const verifyOtp = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, phone_no, otp } = req.body as {
    email: string;
    phone_no: any;
    otp: number;
  };
  if (!email && !otp && !phone_no) {
    return reply.sendError(
      app.polyglot.t("error.auth.emailPhoneOtpRequired"),
      400
    );
  }
  if (email != undefined) {
    const user = await auth.login(email);
    if (!user) {
      return reply.sendError(app.polyglot.t("error.auth.emailNotFound"), 404);
    }
    const otpVerified = await auth.verifyOtp(email, null, otp);
    if (!otpVerified) {
      return reply.sendError(app.polyglot.t("error.auth.invalidOtp"), 401);
    }
    if (otpVerified?.expiration < new Date()) {
      return reply.sendError(app.polyglot.t("error.auth.expiredOtp"), 401);
    } else {
      return reply.sendSuccess(
        null,
        200,
        "Your OTP is successfully verified",
        null,
        null
      );
    }
  }

  if (phone_no != undefined) {
    const user = await auth.findByPhone(phone_no);
    if (!user) {
      return reply.sendError(app.polyglot.t("error.auth.userNotFound"), 404);
    }
    const otpVerified = await auth.verifyOtp(null, phone_no, otp);
    if (!otpVerified) {
      return reply.sendError(app.polyglot.t("error.auth.invalidOtp"), 401);
    }
    if (otpVerified?.expiration < new Date()) {
      return reply.sendError(app.polyglot.t("error.auth.expiredOtp"), 401);
    } else {
      return reply.sendSuccess(
        null,
        200,
        "Your Otp is successfully verified",
        null,
        null
      );
    }
  }
};
