import type { MetadataRoute } from 'next';

import { config } from '@/config';

const rawBaseUrl =
  config.WEB_URL ||
  process.env.NEXT_PUBLIC_WEB_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : 'https://savebucks.com';

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
