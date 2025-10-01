import { getRobotsConfig } from '../robots';

export function GET(): Response {
  const { baseUrl, disallowedPaths } = getRobotsConfig();

  const lines = [
    'User-agent: *',
    'Allow: /',
    ...disallowedPaths.map((path) => `Disallow: ${path}`),
    `Sitemap: ${baseUrl}/sitemap.xml`,
    `Host: ${baseUrl}`,
  ];

  const text = lines.join('\n');

  return new Response(text, {
    headers: {
      'content-type': 'text/plain',
    },
  });
}
