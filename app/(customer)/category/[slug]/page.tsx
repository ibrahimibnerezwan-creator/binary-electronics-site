import { categoryLabel } from "@/lib/catalogue-labels";
import { Metadata } from "next";
import { ProductCard } from "@/components/home/featured-products";
import { ChevronRight, PackageSearch, SlidersHorizontal } from "lucide-react";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      url: `/category/${category.slug}`,
      images: category.image ? [category.image] : [],
    },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await getProductsByCategory(category.id);
  return (
    <section className="sf-wrap sf-page">
      <nav className="sf-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={12} />
        <Link href="/categories">Categories</Link>
        <ChevronRight size={12} />
        <span>{categoryLabel(category.name)}</span>
      </nav>
      <div className="sf-page-head">
        <h1>{categoryLabel(category.name)}</h1>
        <p>
          {products.length} {products.length === 1 ? "product" : "products"} in
          this collection.
        </p>
      </div>
      {products.length > 0 ? (
        <>
          <div className="sf-section-head">
            <p>Find the right fit for your setup.</p>
            <Link
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="sf-text-link"
            >
              <SlidersHorizontal size={16} /> Search and filter
            </Link>
          </div>
          <div className="sf-products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="sf-empty">
          <PackageSearch size={38} />
          <h2>Nothing listed here yet.</h2>
          <p>
            Browse what’s available now, or contact us about a specific part.
          </p>
          <Link href="/products" className="sf-btn">
            Browse all products
          </Link>
        </div>
      )}
    </section>
  );
}
