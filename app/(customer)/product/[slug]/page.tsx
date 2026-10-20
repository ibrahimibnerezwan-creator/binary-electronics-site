import { categoryLabel } from "@/lib/catalogue-labels";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Shield, Truck, ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ReviewForm } from "@/components/product/review-form";
import { formatPrice } from "@/lib/utils";
import { FeaturedProducts } from "@/components/home/featured-products";
import {
  getProductBySlug,
  getRelatedProducts,
  getProductReviews,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    alternates: { canonical: `/product/${product.slug}` },
    description: product.description,
    openGraph: {
      url: `/product/${product.slug}`,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [related, reviews, user] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 3),
    getProductReviews(product.id),
    getCurrentUser(),
  ]);
  const discounted =
    product.comparePrice && product.comparePrice > product.price;
  return (
    <div className="sf-wrap sf-page">
      <nav className="sf-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products">Products</Link>
        {product.category?.slug && (
          <>
            <ChevronRight size={12} />
            <Link href={`/category/${product.category.slug}`}>
              {categoryLabel(product.categoryName)}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span>{product.name}</span>
      </nav>
      <div className="sf-detail-grid">
        <ProductGallery images={product.images} name={product.name} />
        <div className="sf-product-info">
          <span
            className={`sf-product-stock${product.stock > 0 ? "" : " is-unavailable"}`}
          >
            {product.stock > 0
              ? "In stock and available to order"
              : "Currently out of stock"}
          </span>
          <h1>{product.name}</h1>
          {product.reviewsCount > 0 && (
            <div className="sf-product-rating">
              <Star size={15} fill="currentColor" />
              {product.rating} · {product.reviewsCount} reviews
            </div>
          )}
          <p className="sf-detail-price">
            {formatPrice(product.price)}
            {discounted ? (
              <del>{formatPrice(product.comparePrice!)}</del>
            ) : null}
          </p>
          <p className="sf-product-description">
            {product.description.replace(/\\r?\\n/g, "\n")}
          </p>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] || "/logo.png",
              slug: product.slug,
              stock: product.stock,
            }}
          />
          <div className="sf-detail-facts">
            <div>
              <Truck size={21} />
              <div>
                Delivery in Bangladesh
                <small>Charges calculated at checkout</small>
              </div>
            </div>
            <div>
              <Shield size={21} />
              <div>
                Warranty information
                <small>
                  {product.warranty || "Contact us for product terms"}
                </small>
              </div>
            </div>
          </div>
          {Object.keys(product.specs).length > 0 && (
            <section className="sf-specs">
              <h2>Specifications</h2>
              <dl>
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>
      <section className="sf-detail-section">
        <h2>Customer reviews ({reviews.length})</h2>
        {!reviews.length && (
          <p className="sf-results-note">
            No reviews yet. Share your experience with this product.
          </p>
        )}
        {reviews.map((review) => (
          <article key={review.id} className="sf-review">
            <div className="sf-review-head">
              <strong>{review.reviewerName}</strong>
              <span>
                {new Date(review.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div
              className="sf-product-rating"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  size={13}
                  fill={value <= review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            {review.comment && <p>{review.comment}</p>}
            {review.adminReply && (
              <div className="sf-review-reply">
                <strong>Reply from Binary Electronics</strong>
                <p>{review.adminReply}</p>
              </div>
            )}
          </article>
        ))}
        <div style={{ marginTop: 25 }}>
          <ReviewForm
            productId={product.id}
            productSlug={product.slug}
            loggedInName={user?.name}
          />
        </div>
      </section>
      {related.length > 0 && (
        <section className="sf-detail-section">
          <h2>You might also need</h2>
          <FeaturedProducts products={related} noLayout />
        </section>
      )}
    </div>
  );
}
