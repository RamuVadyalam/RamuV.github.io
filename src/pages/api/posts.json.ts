import type { APIContext } from 'astro';
import { getPublishedPosts } from '~/lib/posts';
import { withBase } from '~/lib/url';
import { SITE } from '~/consts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  // Build absolute URLs from the configured origin + the base-aware path so
  // the JSON works whether the site is at apex or under a project path.
  const origin = (context.site ?? new URL(SITE.url)).origin;
  const absolute = (path: string) => new URL(withBase(path), origin).toString();

  const payload = {
    site: SITE.url,
    generatedAt: new Date().toISOString(),
    count: posts.length,
    posts: posts.map((post) => ({
      slug: post.id,
      url: absolute(`/blog/${post.id}`),
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate.toISOString(),
      updatedDate: post.data.updatedDate?.toISOString(),
      tags: post.data.tags,
    })),
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
