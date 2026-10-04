import { categoryLabel } from "@/lib/catalogue-labels";
import Link from "next/link";
import {
  Cpu,
  BatteryCharging,
  PlugZap,
  Wrench,
  Cable,
  Gauge,
  Zap,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: string;
  slug: string;
  name: string;
  productCount: number;
}
function categoryIcon(name: string) {
  const value = name.toLowerCase();
  if (/power|supply/.test(value)) return PlugZap;
  if (/ips|ups|battery/.test(value)) return BatteryCharging;
  if (/ecu|repair/.test(value)) return Wrench;
  if (/stabil/.test(value)) return Gauge;
  if (/weld/.test(value)) return Zap;
  if (/part|component|componet/.test(value)) return Cpu;
  return Cable;
}
export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <div className="sf-categories">
      {categories.map((category) => {
        const Icon = categoryIcon(category.name);
        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="sf-category"
          >
            <span className="sf-category-icon">
              <Icon size={24} strokeWidth={1.5} />
            </span>
            <div>
              <strong>{categoryLabel(category.name)}</strong>
              <small>
                {category.productCount > 0
                  ? `${category.productCount} ${category.productCount === 1 ? "product" : "products"}`
                  : "No products listed"}
              </small>
            </div>
            <ChevronRight size={15} />
          </Link>
        );
      })}
    </div>
  );
}
export function CategoryGrid({ categories }: { categories: Category[] }) {
  const ordered = [...categories].sort(
    (a, b) => b.productCount - a.productCount,
  );
  return (
    <section className="sf-section sf-categories-section">
      <div className="sf-wrap">
        <div className="sf-section-head">
          <div>
            <h2>Find your kind of power.</h2>
            <p>Browse parts and equipment by category.</p>
          </div>
          <Link href="/categories" className="sf-text-link">
            All categories <ArrowUpRight size={17} />
          </Link>
        </div>
        <CategoryTiles categories={ordered} />
      </div>
    </section>
  );
}
