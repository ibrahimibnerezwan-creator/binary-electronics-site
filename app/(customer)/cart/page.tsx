"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useSettings } from "@/lib/settings-context";
import { formatPrice } from "@/lib/utils";
export default function CartPage() {
  const {
    cart,
    removeItem,
    updateQuantity,
    cartTotal,
    cartCount,
    ready,
    syncError,
  } = useCart();
  const settings = useSettings();
  const vatPercentage = parseFloat(settings.vat_percentage || "0");
  const vat = (cartTotal * vatPercentage) / 100;
  const invalidStock = cart.some(
    (item) => item.stock === 0 || item.quantity > (item.stock ?? 999),
  );
  return (
    <section className="sf-wrap sf-page">
      <nav className="sf-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={12} />
        <span>Your cart</span>
      </nav>
      <div className="sf-page-head">
        <h1>Your shopping cart.</h1>
        <p>
          {cartCount
            ? `${cartCount} ${cartCount === 1 ? "item" : "items"} for your next project.`
            : "A new idea is a good place to start."}
        </p>
      </div>
      {!ready ? (
        <p role="status">Checking current prices and stock…</p>
      ) : cart.length === 0 ? (
        <div className="sf-empty">
          <ShoppingBag size={40} />
          <h2>Your cart is empty</h2>
          <p>
            Explore our electronics and find the right part for your next build.
          </p>
          <Link href="/products" className="sf-btn">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="sf-cart-grid">
          <div>
            {cart.map((item) => (
              <article key={item.id} className="sf-cart-item">
                <Link href={`/product/${item.slug}`} className="sf-cart-image">
                  <Image src={item.image} alt={item.name} fill sizes="108px" />
                </Link>
                <div className="sf-cart-item-info">
                  <h3>
                    <Link href={`/product/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <p>{formatPrice(item.price)} each</p>
                  <div className="sf-quantity">
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={15} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock ?? 999)}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  {item.stock === 0 && (
                    <p className="sf-error">
                      This item is no longer available.
                    </p>
                  )}
                </div>
                <div className="sf-cart-item-side">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
            <Link
              href="/products"
              className="sf-text-link"
              style={{ marginTop: 24 }}
            >
              <ArrowLeft size={16} /> Continue shopping
            </Link>
          </div>
          <aside className="sf-cart-summary">
            <h2>Order summary</h2>
            <div className="sf-summary-row">
              <span>Subtotal ({cartCount} items)</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <div className="sf-summary-row">
              <span>Delivery</span>
              <strong>At checkout</strong>
            </div>
            <div className="sf-summary-row">
              <span>VAT ({vatPercentage}%)</span>
              <strong>{formatPrice(vat)}</strong>
            </div>
            <div className="sf-summary-row sf-summary-total">
              <span>Before delivery</span>
              <strong>{formatPrice(cartTotal + vat)}</strong>
            </div>
            {syncError && (
              <div role="alert" className="sf-error">
                {syncError}{" "}
                <button
                  className="sf-text-link"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}
            {invalidStock && (
              <div role="alert" className="sf-error">
                An item exceeds current stock. Reduce its quantity or remove it.
              </div>
            )}
            <Link
              href="/checkout"
              className="sf-btn"
              aria-disabled={!ready || !!syncError || invalidStock}
              onClick={(event) => {
                if (!ready || syncError || invalidStock) event.preventDefault();
              }}
            >
              Proceed to checkout <ArrowRight size={17} />
            </Link>
            <p>Review delivery and payment before placing your order.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
