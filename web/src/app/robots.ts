import type { MetadataRoute } from 'next';

type RobotsConfig = {
  baseUrl: string;
  disallowedPaths: string[];
};

const disallowedPaths = [
  '/api/',
  '/_next/',
  '/out/',
  '/tasks/',
  '/callback/',
  '/profile',
  '/user',
  '/overview',
  '/notification',
  '/chat',
  '/login',
  '/register',
];

export function getRobotsConfig(): RobotsConfig {
  const rawBaseUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : 'https://savebucks.com';

  return {
    baseUrl,
    disallowedPaths: [...disallowedPaths],
  };
}

export default function robots(): MetadataRoute.Robots {
  const { baseUrl, disallowedPaths: disallow } = getRobotsConfig();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
