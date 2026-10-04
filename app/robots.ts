import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/checkout', '/order-confirmation/', '/cart', '/login', '/register'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://binaryelectronics.shopbd.app'}/sitemap.xml`,
  }
}
