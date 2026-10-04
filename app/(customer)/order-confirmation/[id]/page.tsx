import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { decrypt, getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Order receipt",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const token = (await cookies()).get(`receipt-${id}`)?.value;
  let hasProof = false;
  if (token) {
    try {
      const proof = await decrypt(token);
      hasProof = proof.purpose === "receipt" && proof.orderId === id;
    } catch {}
  }
  if (!hasProof && !user) notFound();
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: { with: { product: true } } },
  });
  if (
    !order ||
    (!hasProof && user?.id !== "admin-1" && order.userId !== user?.id)
  )
    notFound();
  return (
    <section className="sf-wrap sf-page sf-prose sf-legacy">
      <div className="glass border border-primary-500/20 p-6 md:p-12 rounded-2xl space-y-6">
        <h1 className="sf-section-title">Order received</h1>
        <p>
          Your order <strong>#{order.id.slice(0, 8).toUpperCase()}</strong> is
          saved. Keep this page for your records.
        </p>
        <p>
          Status: <strong>{order.status}</strong>
        </p>
        <p>
          Payment:{" "}
          <strong>
            {order.paymentMethod.toUpperCase()} — {order.paymentStatus}
          </strong>
        </p>
        <p className="sf-receipt-note">
          {["CANCELLED", "RETURNED"].includes(order.status)
            ? "Contact the store about any outstanding refund or payment adjustment."
            : order.paymentStatus === "PAID"
              ? "Payment has been recorded by the store."
              : order.paymentStatus === "REFUNDED"
                ? "A refund has been recorded by the store."
                : order.paymentMethod === "cod"
                  ? "Pay the total on delivery. The store will confirm delivery arrangements."
                  : "Your transaction reference is awaiting manual verification by the store."}
        </p>
        <ul className="divide-y divide-white/10">
          {order.items.map((item) => (
            <li key={item.id} className="py-3 flex justify-between gap-4">
              <span>
                {item.product?.name || "Product"} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="text-xl font-bold">
          Total including delivery and VAT: {formatPrice(order.total)}
        </p>
        {order.courierTrackingId && (
          <p>Courier tracking: {order.courierTrackingId}</p>
        )}
        <Link href="/products" className="sf-btn">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
