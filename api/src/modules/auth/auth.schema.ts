import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import app from "../../app";
const isSixDigitOtp = (value: number) => value >= 100000 && value <= 999999;
export const passwordSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, "Email is Required")
    .max(255, app.polyglot.t("error.zod.passwordMaxError")),
  password: z
    .string()
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
      message: app.polyglot.t("error.zod.passwordValidation"),
    }),
  recaptcha: z.string().optional().nullable(),
});
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
      message: app.polyglot.t("error.zod.passwordValidation"),
    }),
  password: z
    .string()
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
      message: app.polyglot.t("error.zod.passwordValidation"),
    }),
  recaptcha: z.string().optional().nullable(),
});

export const otpSchema = z.object({
  email: z
    .string()
    .email()
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .optional()
    .nullable(),
  phone_no: z.any(),
  otp: z.number().refine(isSixDigitOtp, {
    message: app.polyglot.t("error.zod.otpValidation"),
  }),
});

export const phoneValidator = z
  .string()
  .max(255, "Phone number must be less than 255 characters")
  .refine(
    (phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone);
      return phoneNumber && phoneNumber.isValid();
    },
    {
      message: app.polyglot.t("error.zod.invalidPhoneNo"),
    }
  );

export const sendOtpSchema = z.object({
  email: z
    .string()
    .email()
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .optional()
    .nullable(),
  phone_no: phoneValidator.optional().nullable(),
});
export const emailSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is Required")
    .max(255, app.polyglot.t("error.zod.passwordMaxError")),
  recaptcha: z.string().optional().nullable(),
});
export type forgotPasswordBodySchema = z.infer<typeof emailSchema>;
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is Required")
    .max(255, app.polyglot.t("error.zod.passwordMaxError")),
  password: z
    .string()
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .refine((password) => password.length > 0, {
      message: app.polyglot.t("error.zod.passwordRequired"),
    }),
  recaptcha: z.string().optional().nullable(),
});

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(1, app.polyglot.t("error.zod.requiredError").replace("#VAR", "Name"))
    .max(
      255,
      app.polyglot
        .t("error.zod.maxError")
        .replace("#VAR", "Name")
        .replace("#VAR", "255")
    ),
  email: z
    .string()
    .min(1, app.polyglot.t("error.zod.emailRequired"))
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .email(app.polyglot.t("error.zod.invalidEmail")),
  password: z
    .string()
    .min(6, app.polyglot.t("error.zod.passwordMinError"))
    .max(255, app.polyglot.t("error.zod.passwordMaxError"))
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password),
      {
        message: app.polyglot.t("error.zod.passwordValidation"),
      }
    ),
  referral: z
    .string()
    .max(255, app.polyglot.t("error.zod.referralCodeMaxError"))
    .optional()
    .nullable(),
  recaptcha: z.string().optional().nullable(),
});
export type loginBodySchema = z.infer<typeof loginSchema>;
export type registerUserSchemas = z.infer<typeof registerUserSchema>;
