"use client";

import { categoryLabel } from "@/lib/catalogue-labels";
import { useState } from "react";
import { ShoppingBag, Star, Heart, Check, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useWishlist, writeWishlist } from "@/lib/wishlist";
import type { ProductForCard } from "@/lib/data";

export function FeaturedProducts({
  products,
  noLayout = false,
}: {
  products: ProductForCard[];
  noLayout?: boolean;
}) {
  const grid = (
    <div className="sf-products">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
  if (noLayout) return grid;
  return (
    <section className="sf-section sf-wrap" aria-labelledby="featured-title">
      <div className="sf-section-head">
        <div>
          <h2 id="featured-title">Ready for your next build.</h2>
          <p>Explore the latest additions to our shelves.</p>
        </div>
        <Link className="sf-text-link" href="/products">
          View all <ArrowUpRight size={17} />
        </Link>
      </div>
      {products.length ? (
        grid
      ) : (
        <div className="sf-empty">
          <h2>No products listed yet</h2>
          <p>Contact the store if you are looking for a specific part.</p>
          <Link href="/contact" className="sf-btn">
            Ask about a product
          </Link>
        </div>
      )}
    </section>
  );
}

export function ProductCard({
  product,
}: {
  product: ProductForCard;
  index?: number;
}) {
  const { addItem, cart } = useCart();
  const saved = useWishlist();
  const wishlisted = saved.includes(product.id);
  const [message, setMessage] = useState("");
  const quantityInCart =
    cart.find((item) => item.id === product.id)?.quantity || 0;
  const atLimit = quantityInCart >= product.stock;
  const handleAdd = () => {
    if (product.stock < 1 || atLimit) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      slug: product.slug,
      stock: product.stock,
    });
    setMessage("Added to cart");
  };
  const toggleSaved = () => {
    try {
      writeWishlist(
        wishlisted
          ? saved.filter((id) => id !== product.id)
          : [...saved, product.id],
      );
      setMessage(wishlisted ? "Removed from saved products" : "Product saved");
    } catch {
      setMessage("Could not save. Please try again.");
    }
  };
  const discounted = product.oldPrice && product.oldPrice > product.price;
  return (
    <article className="sf-product-card">
      <button
        className="sf-product-save"
        aria-label={`${wishlisted ? "Unsave" : "Save"} ${product.name}`}
        aria-pressed={wishlisted}
        onClick={toggleSaved}
      >
        <Heart size={17} fill={wishlisted ? "currentColor" : "none"} />
      </button>
      {discounted ? (
        <span className="sf-product-discount">
          Save {Math.round((1 - product.price / product.oldPrice!) * 100)}%
        </span>
      ) : null}
      <Link
        href={`/product/${product.slug}`}
        className="sf-product-photo"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 400px"
        />
      </Link>
      <div className="sf-product-body">
        <p className="sf-product-category">
          {product.category === "Uncategorized"
            ? "Electronics & components"
            : categoryLabel(product.category)}
        </p>
        <h3>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <span
          className={`sf-product-stock${product.stock > 0 ? "" : " is-unavailable"}`}
        >
          {product.stock > 0 ? "In stock" : "Currently unavailable"}
        </span>
        {product.reviews > 0 && (
          <span className="sf-product-rating">
            <Star size={12} fill="currentColor" /> {product.rating} (
            {product.reviews} reviews)
          </span>
        )}
        <div className="sf-product-bottom">
          <div className="sf-product-price">
            {formatPrice(product.price)}
            {discounted ? <del>{formatPrice(product.oldPrice!)}</del> : null}
          </div>
          <button
            className="sf-cart-btn"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAdd}
            disabled={product.stock < 1 || atLimit}
          >
            {message === "Added to cart" ? (
              <Check size={16} />
            ) : (
              <ShoppingBag size={16} />
            )}
            {product.stock < 1
              ? "Out of stock"
              : atLimit
                ? "Stock limit"
                : "Add to cart"}
          </button>
        </div>
        {message && (
          <p className="sf-live-message" role="status">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}
