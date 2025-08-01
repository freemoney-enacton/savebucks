// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0f699ac9c853400d03d12ecf3da1f68e@o4507893229617152.ingest.us.sentry.io/4507893242462208",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
