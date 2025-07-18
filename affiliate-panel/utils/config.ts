import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LinkIcon,
  Settings,
} from "lucide-react";
import { AppRoutes } from "./routes";

export const Config = {
  env: {
    app: {
      root_domain: process.env.ROOT_DOMAIN || "localhost",
      app_url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      api_url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
      auth_url:
        process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000/auth",
      admin_url:
        process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3000/admin",
      environment: process.env.ENVIRONMENT || "DEVELOPMENT",
      jwt_login_expiry: 86400,
      next_auth_cookie_name:
        process.env.ENVIRONMENT === "PRODUCTION"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      sidebar: [
        {
          name: "Dashboard",
          href: AppRoutes.dashboard,
          icon: LayoutDashboard,
        },
        {
          name: "Links",
          href: "/links",
          icon: LinkIcon,
        },
        {
          name: "Payouts",
          href: "/payouts",
          icon: CreditCard,
        },
        {
          name: "All Transactions",
          href: "/transactions",
          icon: FileText,
        },
        {
          name: "Settings",
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  },
};
