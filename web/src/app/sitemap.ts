import type { MetadataRoute } from 'next';

import { public_get_api } from '@/Hook/Api/Server/use-server';

const MAX_PAGES = 50;

const rawBaseUrl = process.env.NEXT_PUBLIC_WEB_URL
const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : 'https://savebucks.com';

const staticRoutes: string[] = [
  '/',
  '/earn',
  '/offers',
  '/refer-and-earn',
  '/cashout',
  '/all-stores',
  '/playtime',
  '/recommended-offers',
  '/rewards',
  '/support',
  '/faq',
  '/leaderboard',
  '/business-inquiries',
  '/privacy-policy',
  '/terms',
  '/how-it-works',
  '/cookie-policy',
];

type SitemapEntry = MetadataRoute.Sitemap[number];

type EntityWithSlug = {
  slug?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
  modified_at?: string | null;
  modifiedAt?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
};

type PaginatedResponse<T> = {
  data?: T[];
  currentPage?: number;
  lastPage?: number;
  meta?: {
    current_page?: number;
    last_page?: number;
    next_page_url?: string | null;
  };
  pagination?: {
    current_page?: number;
    last_page?: number;
    next_page_url?: string | null;
  };
  links?: {
    next?: string | null;
  };
};

function absolutePath(path: string): string {
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalisedPath}`;
}

function parseDate(value?: string | null): Date | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function resolveLastModified(entity: EntityWithSlug, fallback: Date): Date {
  return (
    parseDate(entity.updated_at) ||
    parseDate(entity.updatedAt) ||
    parseDate(entity.modified_at) ||
    parseDate(entity.modifiedAt) ||
    parseDate(entity.created_at) ||
    parseDate(entity.createdAt) ||
    fallback
  );
}

function withPage(endpoint: string, page: number): string {
  if (page <= 1) {
    return endpoint;
  }
  const [base, query = ''] = endpoint.split('?');
  const params = new URLSearchParams(query);
  params.set('page', String(page));
  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

async function fetchPaginatedCollection<T>(endpoint: string): Promise<T[]> {
  const results: T[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const path = withPage(endpoint, page);
    const response = (await public_get_api({ path })) as PaginatedResponse<T> | undefined;
    const items = Array.isArray(response?.data) ? response?.data : [];

    if (!items.length) {
      break;
    }

    results.push(...items);

    const meta = response?.meta ?? response?.pagination;
    const currentPage = Number(
      meta?.current_page ?? response?.currentPage ?? page,
    );
    const lastPage = Number(meta?.last_page ?? response?.lastPage ?? currentPage);
    const hasNextLink = Boolean(meta?.next_page_url ?? response?.links?.next);

    if (Number.isNaN(currentPage) || Number.isNaN(lastPage)) {
      if (!hasNextLink) {
        break;
      }
    }

    if (!hasNextLink && currentPage >= lastPage) {
      break;
    }
  }

  return results;
}

async function safeFetchCollection<T>(endpoint: string): Promise<T[]> {
  try {
    return await fetchPaginatedCollection<T>(endpoint);
  } catch (error) {
    return [];
  }
}

function addEntry(entries: SitemapEntry[], seen: Set<string>, path: string, lastModified: Date) {
  const url = absolutePath(path);
  if (seen.has(url)) {
    return;
  }
  seen.add(url);
  entries.push({ url, lastModified });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();

  staticRoutes.forEach((route) => {
    addEntry(entries, seen, route, now);
  });

  const [stores, offers, cmsPages] = await Promise.all([
    safeFetchCollection<EntityWithSlug>('stores'),
    safeFetchCollection<EntityWithSlug>('tasks'),
    safeFetchCollection<EntityWithSlug>('cms/pages?status=publish'),
  ]);

  stores
    .filter((store) => store?.slug)
    .forEach((store) => {
      addEntry(entries, seen, `/single-store/${store.slug}`, resolveLastModified(store, now));
    });

  offers
    .filter((offer) => offer?.slug)
    .forEach((offer) => {
      addEntry(entries, seen, `/offer/${offer.slug}`, resolveLastModified(offer, now));
    });

  cmsPages
    .filter((page) => page?.slug)
    .forEach((page) => {
      addEntry(entries, seen, `/${page.slug}`, resolveLastModified(page, now));
    });

  return entries;
}