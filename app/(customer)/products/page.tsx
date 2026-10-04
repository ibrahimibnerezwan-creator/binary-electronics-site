import { categoryLabel } from "@/lib/catalogue-labels";
import { getAllProducts, getAllCategories } from "@/lib/data";
import { ProductCard } from "@/components/home/featured-products";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Products",
  alternates: { canonical: "/products" },
};
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const inStock = params.stock === "1";
  const [all, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);
  const chosen = categories.find((c) => c.slug === category);
  const products = all.filter(
    (p) =>
      (!q ||
        `${p.name} ${p.category} ${categoryLabel(p.category)}`
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!category || (!!chosen && p.category === chosen.name)) &&
      (!inStock || p.stock > 0),
  );
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  if (sort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <section className="sf-wrap sf-page">
      <nav className="sf-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={12} />
        <span>Shop all</span>
      </nav>
      <div className="sf-page-head">
        <h1>Good ideas start here.</h1>
        <p>Explore our electronics, components and power solutions.</p>
      </div>
      <form action="/products" method="get" className="sf-filters">
        <label className="sf-field">
          Search products
          <input
            name="q"
            defaultValue={q}
            type="search"
            placeholder="Search by name or category"
          />
        </label>
        <label className="sf-field">
          Category
          <select name="category" defaultValue={category}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {categoryLabel(c.name)}
              </option>
            ))}
          </select>
        </label>
        <label className="sf-field">
          Sort by
          <select name="sort" defaultValue={sort}>
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
        <div className="sf-filter-actions">
          <label className="sf-checkbox">
            <input
              type="checkbox"
              name="stock"
              value="1"
              defaultChecked={inStock}
            />
            In stock only
          </label>
          <div>
            <Link className="sf-text-link" href="/products">
              Reset
            </Link>
            <button type="submit" className="sf-btn">
              Apply filters
            </button>
          </div>
        </div>
      </form>
      <p className="sf-results-note">
        {products.length} {products.length === 1 ? "product" : "products"}
        {q ? ` matching “${q}”` : ""}
        {chosen ? ` in ${categoryLabel(chosen.name)}` : ""}
      </p>
      {products.length ? (
        <div className="sf-products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="sf-empty">
          <Search size={32} />
          <h2>No matching products</h2>
          <p>Try a different search or explore the full collection.</p>
          <Link href="/products" className="sf-btn">
            Clear filters
          </Link>
        </div>
      )}
    </section>
  );
}
