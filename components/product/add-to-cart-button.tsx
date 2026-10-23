"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Share2,
  Minus,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useWishlist, writeWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart-context";
interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    stock: number;
    sku?: string | null;
  };
}
export function AddToCartButton({ product }: Props) {
  const { addItem, orderNow, cart } = useCart();
  const router = useRouter();
  const [opening, startOpening] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const saved = useWishlist();
  const wishlisted = saved.includes(product.id);
  const [message, setMessage] = useState("");
  const available = Math.max(
    0,
    product.stock -
      (cart.find((item) => item.id === product.id)?.quantity || 0),
  );
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  const add = () => {
    if (available < 1) return;
    const count = Math.min(quantity, available);
    addItem({ ...product, quantity: count });
    setMessage(`Added ${count} × ${product.name} to cart`);
  };
  const order = () => {
    if (!orderNow({ ...product, quantity })) return;
    startOpening(() => router.push("/checkout"));
  };
  const save = () => {
    try {
      writeWishlist(
        wishlisted
          ? saved.filter((id) => id !== product.id)
          : [...saved, product.id],
      );
      setMessage(wishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      setMessage("Could not update wishlist. Please try again.");
    }
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Link copied to clipboard");
    } catch {
      setMessage(
        "Copy the page address from your browser to share this product.",
      );
    }
  };
  return (
    <div className="sf-purchase">
      <div className="sf-quantity-row">
        <span>Quantity</span>
        <div className="sf-quantity">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((value) => Math.min(available, value + 1))
            }
            aria-label="Increase quantity"
            disabled={quantity >= available}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="sf-purchase-actions">
        {product.stock < 1 ? (
          <button className="sf-btn sf-purchase-wide" disabled>
            Out of stock
          </button>
        ) : (
          <>
            <button
              className="sf-btn sf-btn-secondary"
              onClick={add}
              disabled={available < 1}
            >
              <ShoppingBag size={19} />
              {available < 1 ? "All stock in cart" : "Add to cart"}
            </button>
            <button className="sf-btn" onClick={order} disabled={opening}>
              {opening ? (
                "Opening checkout…"
              ) : (
                <>
                  Buy now <ArrowRight size={19} />
                </>
              )}
            </button>
          </>
        )}
        <button
          className="sf-btn sf-btn-secondary sf-square-btn"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={save}
        >
          <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <button
          className="sf-btn sf-btn-secondary sf-square-btn"
          aria-label="Share product"
          onClick={share}
        >
          <Share2 size={19} />
        </button>
      </div>
      {message && (
        <p role="status" className="sf-live-message">
          {message}
        </p>
      )}
    </div>
  );
}
