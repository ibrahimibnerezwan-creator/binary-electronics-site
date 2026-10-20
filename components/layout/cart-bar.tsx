"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

// Pages that already show the cart or have their own primary action.
const HIDDEN_ON = [
  "/cart",
  "/checkout",
  "/login",
  "/register",
  "/contact",
  "/request-item",
];

export function CartBar() {
  const { cart, cartCount, cartTotal, ready, syncError } = useCart();
  const pathname = usePathname();
  if (
    !cartCount ||
    HIDDEN_ON.includes(pathname) ||
    pathname.startsWith("/order-confirmation/")
  )
    return null;
  // Same rule as the cart page: checkout waits for live prices and stock.
  const blocked =
    !ready ||
    !!syncError ||
    cart.some((item) => item.stock === 0 || item.quantity > (item.stock ?? 999));
  return (
    <div className="sf-cartbar" role="region" aria-label="Your cart">
      <ShoppingBag size={21} aria-hidden="true" />
      <p>
        <strong>
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </strong>
        {ready && !syncError ? <span>{formatPrice(cartTotal)}</span> : null}
      </p>
      <Link href="/cart" className="sf-cartbar-view">
        View cart
      </Link>
      <Link
        href="/checkout"
        className="sf-cartbar-checkout"
        aria-disabled={blocked}
        onClick={(event) => {
          if (blocked) event.preventDefault();
        }}
      >
        Checkout <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
