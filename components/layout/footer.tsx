"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export function Footer() {
  const settings = useSettings();
  const socials = [
    { Icon: Facebook, url: settings.facebook, label: "Facebook" },
    { Icon: Instagram, url: settings.instagram, label: "Instagram" },
    { Icon: Youtube, url: settings.youtube, label: "YouTube" },
    { Icon: Twitter, url: settings.twitter, label: "Twitter" },
    { Icon: Linkedin, url: settings.linkedin, label: "LinkedIn" },
    { Icon: Globe, url: settings.tiktok, label: "TikTok" },
  ].filter((item) => item.url && item.url !== "#");
  return (
    <footer className="sf-footer">
      <div className="sf-wrap">
        <div className="sf-footer-grid">
          <div className="sf-footer-brand">
            <Link
              href="/"
              className="sf-brand"
              aria-label={settings.storeName || "Binary Electronics"}
            >
              <span className="sf-brand-image">
                <Image src="/logo.png" alt="" fill sizes="78px" />
              </span>
              <span className="sf-brand-name">
                <strong>{settings.storeName?.split(" ")[0] || "Binary"}</strong>
                <small>Electronics</small>
              </span>
            </Link>
            <p>
              Practical electronics. New possibilities.
              <br />
              Find components and power solutions for the things you want to
              build.
            </p>
            <div className="sf-socials">
              {socials.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              <li>
                <Link href="/products">All products</Link>
              </li>
              <li>
                <Link href="/categories">Shop by category</Link>
              </li>
              <li>
                <Link href="/#new-arrivals">New arrivals</Link>
              </li>
              <li>
                <Link href="/wishlist">Saved products</Link>
              </li>
              <li>
                <Link href="/about">About Binary</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Here to help</h3>
            <ul>
              <li>
                <Link href="/contact">Contact us</Link>
              </li>
              <li>
                <Link href="/shipping-policy">Delivery information</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/login">Your account</Link>
              </li>
              <li>
                <Link href="/cart">Shopping cart</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Let’s connect</h3>
            <ul>
              {settings.address && (
                <li className="sf-footer-address">
                  <MapPin size={16} />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="sf-footer-address">
                  <Phone size={16} />
                  <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                </li>
              )}
              {settings.email && (
                <li className="sf-footer-address">
                  <Mail size={16} />
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              )}
              <li>
                <Link href="/contact" className="sf-text-link">
                  Send an enquiry
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="sf-footer-bottom">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings.storeName || "Binary Electronics"}. All rights reserved.
          </p>
          <div className="sf-payment-options">
            Ways to pay <span>Cash on delivery</span>
            {settings.bkash_number && <span>bKash</span>}
            {settings.nagad_number && <span>Nagad</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
