export const SITE = {
  title: 'Data Engineering Insights & Architecture Notes',
  shortTitle: 'DE Insights',
  description:
    '16+ years in Data Engineering — systems, architecture, and real-world scalability. Notes on lakehouses, streaming, observability, orchestration, and the evolving cloud data ecosystem.',
  author: 'Ramu V',
  // Public URL of the deployed site (origin + base path).
  url: 'https://ramuvadyalam.github.io/RamuV.github.io',
  github: 'https://github.com/ramuvadyalam',
  linkedin: 'https://www.linkedin.com/in/ramu-v-040204188/',
  // Internal nav hrefs are written WITHOUT the base path; consumers wrap
  // them with withBase() from ~/lib/url.
  navLinks: [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/tags', label: 'Tags' },
    { href: '/interests', label: 'Areas of Interest' },
    { href: '/about', label: 'About' },
  ],
} as const;
