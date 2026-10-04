import Link from 'next/link'
import { getPublicStoreSettings } from '@/lib/data'
export const metadata = { title: 'About' }
export default async function AboutPage() {
  const settings = await getPublicStoreSettings()
  return <article className="container mx-auto max-w-3xl px-4 pt-32 pb-20 space-y-8">
    <h1 className="text-4xl font-bold">About {settings.storeName || 'Binary Electronics'}</h1>
    <p className="text-lg">Browse electronic products and components, compare specifications, and order for delivery in Bangladesh.</p>
    {settings.storeDescription && <p>{settings.storeDescription}</p>}
    <h2 className="text-2xl font-bold">Choosing a product</h2><p>Check the product page for its price, available stock and warranty information. If you need help with compatibility or specifications, send us an enquiry before ordering.</p>
    {settings.address && <p>Store address: {settings.address}</p>}
    <div className="flex flex-wrap gap-6"><Link className="text-primary-500 underline" href="/products">Browse products</Link><Link className="text-primary-500 underline" href="/contact">Contact the store</Link></div>
  </article>
}
