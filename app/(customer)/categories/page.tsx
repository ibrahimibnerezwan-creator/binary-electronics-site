import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CategoryTiles } from "@/components/home/category-grid";
import { getAllCategoriesWithCount } from "@/lib/data";
export const revalidate = 60;
export const metadata = {
  title: "Categories",
  alternates: { canonical: "/categories" },
};
export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithCount();
  return (
    <section className="sf-wrap sf-page">
      <nav className="sf-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={12} />
        <span>Categories</span>
      </nav>
      <div className="sf-page-head">
        <h1>Find the right starting point.</h1>
        <p>
          Browse our product categories. Available stock is shown for each
          collection.
        </p>
      </div>
      <CategoryTiles categories={categories} />
    </section>
  );
}
