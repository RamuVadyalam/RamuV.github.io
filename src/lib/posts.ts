import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getPublishedPosts();
  const tags = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }
  return tags;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}
