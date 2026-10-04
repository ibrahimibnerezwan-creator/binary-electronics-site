"use client";
import { whatsappNumber } from "@/lib/commerce";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
export function WhatsAppCTA() {
  const settings = useSettings();
  const pathname = usePathname();
  const number = whatsappNumber(settings.whatsapp || settings.phone || "");
  if (
    ["/checkout", "/cart", "/login", "/register", "/contact"].includes(
      pathname,
    ) ||
    pathname.startsWith("/order-confirmation/")
  )
    return null;
  return (
    <Link
      className="sf-contact-float"
      href={number ? `https://wa.me/${number}` : "/contact"}
      target={number ? "_blank" : undefined}
      rel={number ? "noopener noreferrer" : undefined}
      aria-label={number ? "Chat on WhatsApp" : "Contact the store"}
    >
      <MessageCircle size={21} />
      <span>Need help?</span>
    </Link>
  );
}
