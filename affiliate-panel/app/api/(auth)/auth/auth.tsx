import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import {
  getAffiliateByEmail,
  getAffiliateStatus,
} from "@/models/affiliates-model";
import { Config } from "@/utils/config";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      status?: string | null;
    };
  }
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    status?: string | null;
    remember?: boolean; // Add remember field to User interface
  }
  interface JWT {
    remember?: boolean; // Add remember field to JWT interface
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
    // maxAge: Config.env.app.jwt_login_expiry, // Default session duration
    updateAge: 5 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        remember: { label: "Keep Me Signed In", type: "checkbox" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password, remember } = credentials;

        let user;
        try {
          user = await getAffiliateByEmail(email);
        } catch (err) {
          // console.log(err);
          return null;
        }
        if (user === null || user === undefined || !user.data) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.data.password);

        if (!isValid) {
          return null;
        }

        const data = {
          id: user.data.id.toString(),
          email: user.data.email,
          name: user.data.name || null,
          status: user.data.approvalStatus || "pending",
          remember: remember === "true" || remember === true,
        };
        // console.log("data")
        return data;
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.status = user.status;
        token.remember = user.remember;
        if (user.remember) {
          token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        } else {
          token.exp =
            Math.floor(Date.now() / 1000) + Config.env.app.jwt_login_expiry;
        }
      } else {
        if (token.email) {
          try {
            const affiliate = await getAffiliateStatus(token.email);
            if (affiliate && affiliate.data) {
              token.status = affiliate.data.status || "pending";
            }

            if (token.remember && !token.exp) {
              token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      // console.log("jwt-token:",token)
      return token;
    },

    async session({ session, token }) {
      // console.log("session:",session)
      // console.log("token:",token)
      if (token.id) {
        session.user.id = token.id as string;
        session.user.status = token.status as string;
      }
      // if (session.user) {
      //   session.user.id = token.id as string;
      //   session.user.status = token.status as string;
      // }
      return session;
    },
  },

  // cookies: {
  //   sessionToken: {
  //     name:
  //       Config.env.app.environment === "PRODUCTION" ||
  //       Config.env.app.environment === "STAGING"
  //         ? `__Secure-next-auth.session-token`
  //         : `next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure:
  //         Config.env.app.environment === "PRODUCTION" ||
  //         Config.env.app.environment === "STAGING",
  //       domain: Config.env.app.root_domain.startsWith(".")
  //         ? Config.env.app.root_domain
  //         : "." + Config.env.app.root_domain,
  //       // Dynamic maxAge based on remember preference - handled in JWT callback
  //     },
  //   },
  // },

  trustHost: true,
  debug: process.env.ENVIRONMENT === "DEVELOPMENT",
});
