'use client'
import { useWishlist } from '@/lib/wishlist'
import { ProductCard } from '@/components/home/featured-products'
import type { ProductForCard } from '@/lib/data'
import Link from 'next/link'
export function Wishlist({products}:{products:ProductForCard[]}){
 const saved=useWishlist()
 const selected=products.filter(p=>saved.includes(p.id))
 return <section className="container mx-auto px-4 pt-28 pb-20 space-y-8"><h1 className="text-4xl font-bold">Saved products</h1><p>Saved on this browser. Open a product to change its saved status.</p>{selected.length?<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">{selected.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<p>No available products saved yet. <Link href="/products" className="underline text-primary-500">Browse products</Link></p>}</section>
}
