// Use one origin for metadata, robots and the sitemap; retain both existing env names.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://binaryelectronics.shopbd.app'
).replace(/\/+$/, '')
