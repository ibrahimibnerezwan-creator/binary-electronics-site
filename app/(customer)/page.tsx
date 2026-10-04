import Link from "next/link";
import { MessageCircle, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/layout/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { getNewArrivals, getAllCategoriesWithCount } from "@/lib/data";

export const revalidate = 60;
export default async function Home() {
  const [products, categories] = await Promise.all([
    getNewArrivals(6, true),
    getAllCategoriesWithCount(),
  ]);
  return (
    <>
      <Hero />
      <div id="new-arrivals" style={{ scrollMarginTop: 150 }}>
        <FeaturedProducts products={products} />
      </div>
      <CategoryGrid categories={categories} />
      <section className="sf-section sf-wrap">
        <div className="sf-help-grid">
          <div className="sf-help">
            <MessageCircle size={28} strokeWidth={1.5} />
            <h2>The right part makes all the difference.</h2>
            <p>
              Not sure which controller or power supply fits your setup? Send us
              your requirements before you order.
            </p>
            <Link href="/contact" className="sf-btn">
              Let’s talk about your project <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="sf-note">
            <SlidersHorizontal size={28} strokeWidth={1.5} />
            <h2>
              A little checking.
              <br />A better fit.
            </h2>
            <p>
              Match the voltage, current and connections to your equipment.
              Check each product’s specifications and ask us about anything
              you’re unsure of.
            </p>
            <Link href="/products" className="sf-text-link">
              Explore products <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="sf-newsletter">
        <div className="sf-wrap">
          <div>
            <h2>Keep your ideas powered.</h2>
            <p>Sign up for product news and updates from Binary Electronics.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
