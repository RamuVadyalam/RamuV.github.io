import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '~/lib/posts';
import { withBase } from '~/lib/url';
import { SITE } from '~/consts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    // context.site is the configured `site` origin; @astrojs/rss prepends it
    // to each item's `link`, so links must already include the base path.
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: withBase(`/blog/${post.id}/`),
    })),
    customData: `<language>en-us</language>`,
  });
}
