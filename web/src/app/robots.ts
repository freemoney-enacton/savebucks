import { config } from '@/config';
import type { MetadataRoute } from 'next';

type RobotsConfig = {
  baseUrl: string;
  disallowedPaths: string[];
};

const FALLBACK_DISALLOWED_PATHS = [
  '/api/',
  '/out/',
  '/chat',
];

function sanitizeBaseUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.includes('undefined') || url.includes('null')) return undefined;
  return url.replace(/\/$/, '');
}

function normalizePath(path: string): string | null {
  const trimmed = path.trim();
  if (!trimmed) return null;
  const formatted = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return formatted;
}

function parseDisallowPaths(rawPaths: string | null | undefined): string[] {
  if (!rawPaths) return [];

  const uniquePaths = new Set<string>();
  const normalizedInput = rawPaths.replace(/\r?\n/g, ',');

  normalizedInput
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      const normalized = normalizePath(value);
      if (normalized) {
        uniquePaths.add(normalized);
      }
    });

  return Array.from(uniquePaths);
}

async function fetchDisallowedPaths(): Promise<string[]> {
  const baseApiEndpoint = sanitizeBaseUrl(process.env.NEXT_PUBLIC_BASE_API_END_POINT);
  const apiEndpoint = sanitizeBaseUrl(config.API_END_POINT);

  const settingsUrl = baseApiEndpoint
    ? `${baseApiEndpoint}/api/v1/settings`
    : apiEndpoint
      ? `${apiEndpoint}/settings`
      : undefined;

  console.log('Settings URL for robots.txt:', settingsUrl);
  if (!settingsUrl) {
    return [];
  }

  try {
    const response = await fetch(settingsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-language': ' en'
      },
      cache: 'no-store',
    });

    console.log('Fetched settings for robots.txt:', response.status);

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    const settings = payload?.data
    const rawDisallow = settings?.seo?.robots_disallow_paths;

    console.log('Raw disallow paths from settings:', rawDisallow);

    return parseDisallowPaths(rawDisallow);
  } catch (error) {
    return [];
  }
}

export async function getRobotsConfig(): Promise<RobotsConfig> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : 'https://savebucks.com';

  const disallowedPaths = await fetchDisallowedPaths();

  return {
    baseUrl,
    disallowedPaths: disallowedPaths.length > 0 ? disallowedPaths : [...FALLBACK_DISALLOWED_PATHS],
  };
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { baseUrl, disallowedPaths: disallow } = await getRobotsConfig();

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