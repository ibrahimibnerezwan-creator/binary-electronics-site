"use client";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard } from "@/components/home/featured-products";
import type { ProductForCard } from "@/lib/data";
import Link from "next/link";
export function Wishlist({ products }: { products: ProductForCard[] }) {
  const saved = useWishlist();
  const selected = products.filter((p) => saved.includes(p.id));
  return (
    <section className="sf-wrap sf-page space-y-8">
      <h1 className="sf-section-title">Saved products</h1>
      <p>Saved on this browser. Open a product to change its saved status.</p>
      {selected.length ? (
        <div className="sf-products">
          {selected.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <p>
          No available products saved yet.{" "}
          <Link href="/products" className="sf-text-link">
            Browse products
          </Link>
        </p>
      )}
    </section>
  );
}
