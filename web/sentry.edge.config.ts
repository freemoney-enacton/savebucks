// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0f699ac9c853400d03d12ecf3da1f68e@o4507893229617152.ingest.us.sentry.io/4507893242462208",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
