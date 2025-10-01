import { getRobotsConfig } from '../robots';

export async function GET(): Promise<Response> {
  const { baseUrl, disallowedPaths } = await getRobotsConfig();

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