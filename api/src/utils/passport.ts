import fs from "fs";
import fastifyPassport from "@fastify/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as AppleStrategy } from "passport-apple";
import * as auth from "../modules/auth/auth.model";
import * as user from "../modules/user/user.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config/config";
import path from "path";
import jwt from "jsonwebtoken";
import { bonusDetails } from "../modules/user-bonuses/bonuses.model";
import { handleBonusAndNotifications } from "./bonusHandle";
import { downloadImage } from "./downloadImage";
import { moveUploadedFile } from "./ImageUpload";
import { db } from "../database/database";
import { sendConversionRequest } from "./sendAffiliatePostback";
import { extractDaisyconAttribution } from "./affiliateAttribution";
fastifyPassport.use(
  new GoogleStrategy(
    {
      clientID: config.env.passport.googleClientID,
      clientSecret: config.env.passport.googleClientSecret,
      callbackURL: config.env.passport.googleCallbackUrl,
      passReqToCallback: true,
    },
    async (
      req,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) => {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const name = profile.displayName;
      const googleProfilePicUrl =
        profile.photos && profile.photos.length > 0
          ? profile.photos[0].value
          : null;
      console.log(googleProfilePicUrl);
      const referralCode = (Math.random() + 1).toString(36).substring(7);
      const referrerCode = req.cookies.referral || req.cookies.referrer_code;
      const defaultClickCode = req.cookies.click_code;
      const { utmSource: daisyconUtmSource, affiliateClickCode } =
        extractDaisyconAttribution(req.cookies || {});
      const click_code = affiliateClickCode ?? defaultClickCode;
      // const userExist = await auth.userExist("google", googleId);
      const userExist = await auth.login(email);
      if (userExist) {
        return done(null, { ...userExist, userID: Number(userExist.id) });
      }
      const lang = req.headers["x-language"]
        ? req.headers["x-language"][0]
        : "en";

      let avatar = null;
      if (googleProfilePicUrl) {
        const localProfilePic = await downloadImage(googleProfilePicUrl);
        console.log("Downloaded profile pic:", localProfilePic);

        // Move it to permanent location
        const finalPath = await moveUploadedFile(
          localProfilePic.filePath,
          "uploads/profiles"
        );

        // Create avatar object
        avatar = {
          filename: localProfilePic.fileName,
          path: finalPath,
          url: `${config.env.app.appUrl}/${path.basename("uploads")}/profiles/${
            localProfilePic.fileName
          }`,
          mimetype: "image/jpeg", // Assuming it's a JPEG
          size: fs.statSync(finalPath).size, // Get the actual file size
        };

        console.log("avatar", avatar);
      }

      const result = await auth.registerSocial(
        name,
        email,
        googleId,
        referralCode,
        "google",
        lang,
        click_code || null,
        referrerCode,
        req.cookies.is_app,
        daisyconUtmSource
      );

      let referredBy = null;
      if (result && result.insertId) {
        if (avatar) {
          const users = await user.findByEmail(email);

          await user.updateUser(
            users?.id!,
            email,
            users?.phone_no || undefined,
            name,
            true,
            true,
            avatar?.url
          );
        }

        if (referrerCode) {
                  referredBy = await user.referCodeUser(referrerCode);
                  console.log("Referred by user:", referredBy);
                }
        
                let joinBonus = await bonusDetails("join_no_refer");
                const joinWithRefer = await bonusDetails("join_with_refer");
                if (referredBy && joinWithRefer && joinWithRefer !== undefined) {
                  joinBonus = joinWithRefer;
                }
                console.log("Join bonus details:", joinBonus);
        
                await handleBonusAndNotifications(
                  Number(result.insertId),
                  joinBonus,
                  referredBy
                );
        const userData = await db
          .selectFrom("users")
          .select(["affiliate_click_code"])
          .where("id", "=", Number(result.insertId))
          .executeTakeFirst();

        if (userData && userData.affiliate_click_code && result.insertId) {
          const res = await sendConversionRequest({
            tracking_code: "registration",
            click_code: userData?.affiliate_click_code,
            transaction_id: result?.insertId?.toString(),
          });
        }
        return done(null, { ...profile, userID: Number(result.insertId) });
      }
    }
  )
);

fastifyPassport.use(
  new FacebookStrategy(
    {
      clientID: config.env.passport.facebookClientID,
      clientSecret: config.env.passport.facebookClientSecret,
      callbackURL: config.env.passport.facebookCallbackUrl,
      profileFields: ["id", "emails", "name", "photos"],
      passReqToCallback: true,
    },
    async function (
      req,
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: any
    ) {
      const email = profile.emails[0].value ?? null;
      const facebookId = profile.id;
      const name = profile.displayName ?? profile._json.first_name;
      const fbProfilePicUrl =
        profile.photos && profile.photos.length > 0
          ? profile.photos[0].value
          : null;
      console.log(fbProfilePicUrl);
      const referralCode = (Math.random() + 1).toString(36).substring(7);
      const referrerCode = req.cookies.referral || req.cookies.referrer_code;
      const userExist = await auth.login(email);
      const lang = req.headers["x-language"]
        ? req.headers["x-language"][0]
        : "en";
      const defaultClickCode = req.cookies.click_code;
      const { utmSource: daisyconUtmSource, affiliateClickCode } =
        extractDaisyconAttribution(req.cookies || {});
      const click_code = affiliateClickCode ?? defaultClickCode;
      console.log("Facebook profile", profile);
      // const userExist = await auth.userExist("facebook", facebookId);
      //Join No Refer bonus_code
      const noReferBonus = await bonusDetails("join_no_refer");
      if (email == null) {
        if (userExist) {
          return cb(null, userExist);
        }
        let avatar = null;
        if (fbProfilePicUrl) {
          const localProfilePic = await downloadImage(fbProfilePicUrl);
          console.log("Downloaded profile pic:", localProfilePic);

          // Move it to permanent location
          const finalPath = await moveUploadedFile(
            localProfilePic.filePath,
            "uploads/profiles"
          );

          // Create avatar object
          avatar = {
            filename: localProfilePic.fileName,
            path: finalPath,
            url: `${config.env.app.appUrl}/${path.basename(
              "uploads"
            )}/profiles/${localProfilePic.fileName}`,
            mimetype: "image/jpeg", // Assuming it's a JPEG
            size: fs.statSync(finalPath).size, // Get the actual file size
          };

          console.log("avatar", avatar);
        }

        const result = await auth.registerSocial(
          name,
          null,
          facebookId,
          referralCode,
          "facebook",
          lang,
          click_code || null,
          referrerCode,
          req.cookies.is_app,
          daisyconUtmSource
        );

        let referredBy = null;
        if (result && result.insertId) {
          if (avatar) {
            const users = await user.findByEmail(email);

            await user.updateUser(
              users?.id!,
              email,
              users?.phone_no || undefined,
              name,
              true,
              true,
              avatar?.url
            );
          }
          if (referrerCode) {
            referredBy = await user.referCodeUser(referrerCode);
          }
          let joinBonus = await bonusDetails("join_no_refer");
          const joinWithRefer = await bonusDetails("join_with_refer");
          if (referredBy && joinWithRefer && joinWithRefer !== undefined) {
            joinBonus = joinWithRefer;
          }

          await handleBonusAndNotifications(
            Number(result.insertId),
            joinBonus,
            referredBy
          );
          const userData = await db
            .selectFrom("users")
            .select(["affiliate_click_code"])
            .where("id", "=", Number(result.insertId))
            .executeTakeFirst();

          if (userData && userData.affiliate_click_code && result.insertId) {
            const res = await sendConversionRequest({
              tracking_code: "registration",
              click_code: userData?.affiliate_click_code,
              transaction_id: result?.insertId?.toString(),
            });
          }
          return cb(null, profile);
        }
      } else {
        if (userExist) {
          return cb(null, userExist);
        }
        let avatar = null;
        if (fbProfilePicUrl) {
          const localProfilePic = await downloadImage(fbProfilePicUrl);
          console.log("Downloaded profile pic:", localProfilePic);

          // Move it to permanent location
          const finalPath = await moveUploadedFile(
            localProfilePic.filePath,
            "uploads/profiles"
          );

          // Create avatar object
          avatar = {
            filename: localProfilePic.fileName,
            path: finalPath,
            url: `${config.env.app.appUrl}/${path.basename(
              "uploads"
            )}/profiles/${localProfilePic.fileName}`,
            mimetype: "image/jpeg", // Assuming it's a JPEG
            size: fs.statSync(finalPath).size, // Get the actual file size
          };

          console.log("avatar", avatar);
        }

        const result = await auth.registerSocial(
          name,
          email,
          facebookId,
          referralCode,
          "facebook",
          lang,
          click_code || null,
          referrerCode,
          req.cookies.is_app,
          daisyconUtmSource
        );

        let referredBy = null;
        if (result && result.insertId) {
          if (avatar) {
            const users = await user.findByEmail(email);

            await user.updateUser(
              users?.id!,
              email,
              users?.phone_no || undefined,
              name,
              true,
              true,
              avatar?.url
            );
          }
          if (referrerCode) {
            referredBy = await user.referCodeUser(referrerCode);
          }
          let joinBonus = await bonusDetails("join_no_refer");
          const joinWithRefer = await bonusDetails("join_with_refer");
          if (referredBy && joinWithRefer && joinWithRefer !== undefined) {
            joinBonus = joinWithRefer;
          }

          await handleBonusAndNotifications(
            Number(result.insertId),
            joinBonus,
            referredBy
          );
          const userData = await db
            .selectFrom("users")
            .select(["affiliate_click_code"])
            .where("id", "=", Number(result.insertId))
            .executeTakeFirst();

          if (userData && userData.affiliate_click_code && result.insertId) {
            const res = await sendConversionRequest({
              tracking_code: "registration",
              click_code: userData?.affiliate_click_code,
              transaction_id: result?.insertId?.toString(),
            });
          }
          return cb(null, profile);
        }
      }
    }
  )
);

const appleKeyName = config.env.passport.appleKeyName;

const privateKey = fs.readFileSync(path.join(__dirname, appleKeyName), "utf8");
fastifyPassport.use(
  new AppleStrategy(
    {
      clientID: config.env.passport.appleClientID,
      teamID: config.env.passport.appleTeamID,
      callbackURL: config.env.passport.appleCallbackUrl,
      keyID: config.env.passport.appleKeyID,
      // privateKeyString: config.env.passport.applePrivateKey,
      privateKeyString: privateKey,
      passReqToCallback: true,
      scope: ["name", "email"],
    },
    async function (req, accessToken, refreshToken, idToken, profile, cb: any) {
      const decodedToken: any = jwt.decode(idToken);
      const email = decodedToken?.email || decodedToken?.user?.email;
      const subId = decodedToken?.sub;
      const match = decodedToken?.email.match(/^[a-zA-Z]+/);
      const name = match ? match[0] : "";
      const referralCode = (Math.random() + 1).toString(36).substring(7);
      const referrerCode = req.cookies.referral || req.cookies.referrer_code;
      const defaultClickCode = req.cookies.click_code;
      const { utmSource: daisyconUtmSource, affiliateClickCode } =
        extractDaisyconAttribution(req.cookies || {});
      const click_code = affiliateClickCode ?? defaultClickCode;
      const userExist = await auth.login(email);
      const lang = req.headers["x-language"]
        ? req.headers["x-language"][0]
        : "en";

      console.log("Facebook profile", decodedToken);

      if (
        email &&
        (email.endsWith("@privaterelay.appleid.com") ||
          email.endsWith("@icloud.com"))
      ) {
        if (userExist) {
          userExist["metadata"] = null;
          return cb(null, userExist);
        }
        
        const result = await auth.registerSocial(
          name,
          email,
          subId,
          referralCode,
          "apple",
          lang,
          click_code || null,
          referrerCode,
          req.cookies.is_app,
          daisyconUtmSource
        );
        let referredBy = null;
        if (result && result.insertId) {
          if (referrerCode) {
            referredBy = await user.referCodeUser(referrerCode);
          }
          let joinBonus = await bonusDetails("join_no_refer");
          const joinWithRefer = await bonusDetails("join_with_refer");
          if (referredBy && joinWithRefer && joinWithRefer !== undefined) {
            joinBonus = joinWithRefer;
          }

          await handleBonusAndNotifications(
            Number(result.insertId),
            joinBonus,
            referredBy
          );
          const userData = await db
            .selectFrom("users")
            .select(["affiliate_click_code"])
            .where("id", "=", Number(result.insertId))
            .executeTakeFirst();

          if (userData && userData.affiliate_click_code && result.insertId) {
            const res = await sendConversionRequest({
              tracking_code: "registration",
              click_code: userData?.affiliate_click_code,
              transaction_id: result?.insertId?.toString(),
            });
          }
          return cb(null, decodedToken);
        }
      } else {
        if (userExist) {
          userExist["metadata"] = null;
          return cb(null, userExist);
        }
        const result = await auth.registerSocial(
          name,
          email,
          subId,
          referralCode,
          "apple",
          lang,
          click_code || null,
          referrerCode,
          req.cookies.is_app,
          daisyconUtmSource
        );
        let referredBy = null;
        if (result && result.insertId) {
          if (referrerCode) {
            referredBy = await user.referCodeUser(referrerCode);
          }
          let joinBonus = await bonusDetails("join_no_refer");
          const joinWithRefer = await bonusDetails("join_with_refer");
          if (referredBy && joinWithRefer && joinWithRefer !== undefined) {
            joinBonus = joinWithRefer;
          }

          await handleBonusAndNotifications(
            Number(result.insertId),
            joinBonus,
            referredBy
          );
          const userData = await db
            .selectFrom("users")
            .select(["affiliate_click_code"])
            .where("id", "=", Number(result.insertId))
            .executeTakeFirst();

          if (userData && userData.affiliate_click_code) {
            const res = await sendConversionRequest({
              tracking_code: "register",
              click_code: userData?.affiliate_click_code,
              transaction_id: result.insertId.toString(),
            });
          }
          return cb(null, decodedToken);
        }
      }
    }
  )
);
// Serialize user into the session
// register a serializer that stores the user object's id in the session ...
fastifyPassport.registerUserSerializer(async (user, req: FastifyRequest) => {
  const { id, displayName, username }: any = user;

  const userForSession = { id, displayName, username };
  return userForSession;
});

// ... and then a deserializer that will fetch that user from the database when a request with an id in the session arrives
fastifyPassport.registerUserDeserializer(async (userFromSession, request) => {
  return userFromSession;
});
