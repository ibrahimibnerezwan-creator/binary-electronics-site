import Link from "next/link";
export default function NotFound() {
  return (
    <section className="sf-wrap sf-page">
      <div className="sf-empty">
        <h1 className="sf-section-title">This page has moved on.</h1>
        <p>The page doesn’t exist, or the product may have been removed.</p>
        <Link href="/products" className="sf-btn">
          Browse products
        </Link>
      </div>
    </section>
  );
}
