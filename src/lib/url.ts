// import.meta.env.BASE_URL reflects the `base` config. Whether it carries a
// trailing slash depends on Astro's `trailingSlash` setting, so we normalize.
const BASE_RAW = import.meta.env.BASE_URL || '/';
const BASE_NO_TRAIL = BASE_RAW.replace(/\/+$/, '');

/**
 * Prepend the configured Astro `base` to an internal path. Always emits exactly
 * one slash between base and path. Pass-through for absolute URLs, fragments,
 * and mailto: links.
 *
 *   withBase('/blog')          → '/RamuV.github.io/blog'
 *   withBase('blog/foo/')      → '/RamuV.github.io/blog/foo/'
 *   withBase('/')              → '/RamuV.github.io/'
 *   withBase('https://x/y')    → 'https://x/y'
 *   withBase('#section')       → '#section'
 */
export function withBase(path: string): string {
  if (!path) return BASE_NO_TRAIL + '/';
  if (/^([a-z]+:)?\/\//i.test(path)) return path;
  if (path.startsWith('#') || path.startsWith('mailto:')) return path;
  if (path === '/') return BASE_NO_TRAIL + '/';
  return BASE_NO_TRAIL + '/' + path.replace(/^\/+/, '');
}

/**
 * Strip the base prefix from a runtime pathname so internal nav highlighting
 * can compare against base-less hrefs.
 *
 *   stripBase('/RamuV.github.io/blog/foo') → '/blog/foo'
 *   stripBase('/RamuV.github.io/')         → '/'
 *   stripBase('/RamuV.github.io')          → '/'
 */
export function stripBase(pathname: string): string {
  if (!BASE_NO_TRAIL) return pathname;
  if (pathname === BASE_NO_TRAIL) return '/';
  if (pathname.startsWith(BASE_NO_TRAIL + '/')) {
    return pathname.slice(BASE_NO_TRAIL.length) || '/';
  }
  return pathname;
}
