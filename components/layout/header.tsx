"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  Heart,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useSettings } from "@/lib/settings-context";

interface HeaderProps {
  user?: { id: string; name: string; email: string } | null;
}

function SearchForm({ mobile = false }: { mobile?: boolean }) {
  return (
    <form
      action="/products"
      method="get"
      role="search"
      aria-label={mobile ? "Mobile product search" : "Product search"}
      className="sf-header-search"
    >
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        name="q"
        aria-label="Search products"
        placeholder="What are you looking for?"
        maxLength={200}
      />
      <button type="submit" aria-label="Search">
        <ArrowUpRight size={19} />
      </button>
    </form>
  );
}

export function Header({ user }: HeaderProps = {}) {
  const settings = useSettings();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/login", { method: "DELETE" });
      if (response.ok) {
        // A full navigation also discards layouts cached under the old session.
        window.location.assign("/");
      } else {
        setLogoutError("Could not sign out. Please try again.");
      }
    } catch {
      setLogoutError(
        "Could not sign out. Check your connection and try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  }
  const links = [
    { name: "Home", href: "/" },
    { name: "Shop all", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "New arrivals", href: "/#new-arrivals" },
    { name: "About us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  return (
    <>
      <a href="#main-content" className="sf-skip">
        Skip to content
      </a>
      <div className="sf-topbar" role="region" aria-label="Store information">
        <div className="sf-wrap">
          <span>
            <Truck size={13} /> Electronics for your next project. Delivered in
            Bangladesh.
          </span>
          <Link className="sf-topbar-help" href="/contact">
            Need a hand? Get in touch <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
      <header className="sf-header">
        {logoutError && (
          <p role="alert" className="sf-wrap sf-error">
            {logoutError}
          </p>
        )}
        <div className="sf-wrap sf-header-main">
          <Link
            href="/"
            className="sf-brand"
            aria-label={settings.storeName || "Binary Electronics"}
            onClick={() => setOpen(false)}
          >
            <span className="sf-brand-image">
              <Image src="/logo.png" alt="" fill sizes="43px" />
            </span>
            <span className="sf-brand-name">
              <strong>{settings.storeName?.split(" ")[0] || "Binary"}</strong>
              <small>Electronics</small>
            </span>
          </Link>
          <SearchForm />
          <div className="sf-header-actions">
            <Link
              href="/products"
              className="sf-header-action sf-mobile-search"
              aria-label="Search products"
            >
              <Search size={20} />
            </Link>
            <Link
              href="/wishlist"
              className="sf-header-action sf-saved"
              aria-label="Saved products"
            >
              <Heart size={20} />
              <span>Saved</span>
            </Link>
            {user ? (
              <button
                className="sf-header-action sf-account"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Logout"
              >
                <LogOut size={19} />
                <span>{loggingOut ? "Signing out…" : "Sign out"}</span>
              </button>
            ) : (
              <Link href="/login" className="sf-header-action sf-account">
                <User size={20} />
                <span>Sign in</span>
              </Link>
            )}
            <Link
              href="/cart"
              className="sf-header-action"
              aria-label={`Shopping cart, ${cartCount} items`}
              onClick={() => setOpen(false)}
            >
              <ShoppingBag size={21} />
              <span>Cart</span>
              <span className="sf-cart-count">{cartCount}</span>
            </Link>
            <button
              ref={toggle}
              className="sf-menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        <div className="sf-nav-row">
          <div className="sf-wrap">
            <nav className="sf-desktop-nav" aria-label="Main navigation">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <span className="sf-nav-note">
              <Truck size={15} /> Cash on delivery available
            </span>
          </div>
        </div>
        {open && (
          <div className="sf-mobile-nav sf-wrap" id="mobile-menu">
            <nav aria-label="Mobile navigation">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/wishlist" onClick={() => setOpen(false)}>
                Saved products
              </Link>
              {user ? (
                <button onClick={handleLogout} disabled={loggingOut}>
                  {loggingOut
                    ? "Signing out…"
                    : `Sign out (${user.name.split(" ")[0]})`}
                </button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in / Create an account
                </Link>
              )}
            </nav>
            <SearchForm mobile />
          </div>
        )}
      </header>
    </>
  );
}
