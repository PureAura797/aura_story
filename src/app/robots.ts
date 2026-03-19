import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/', '/api/', '/_next/static/', '/_next/image/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/admin/'],
      },
    ],
    sitemap: 'https://pureaura.ru/sitemap.xml',
    host: 'https://pureaura.ru',
  }
}
