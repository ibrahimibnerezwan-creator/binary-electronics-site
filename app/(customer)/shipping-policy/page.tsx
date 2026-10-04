import Link from "next/link";
import { getPublicStoreSettings } from "@/lib/data";
import { deliverySettings } from "@/lib/commerce";
import { formatPrice } from "@/lib/utils";
export const metadata = { title: "Delivery information" };
export default async function ShippingPage() {
  const rates = deliverySettings(await getPublicStoreSettings());
  return (
    <article className="sf-wrap sf-page sf-prose space-y-8">
      <h1 className="text-4xl font-bold">Delivery information</h1>
      <h2 className="text-2xl font-bold">Charges</h2>
      <p>
        Inside Dhaka: {formatPrice(rates.inside)}. Outside Dhaka:{" "}
        {formatPrice(rates.outside)}. Delivery charges and any applicable VAT
        appear in your checkout total before you place an order.
      </p>
      <h2 className="text-2xl font-bold">Processing and delivery</h2>
      <p>
        Provide a complete address and a reachable Bangladesh mobile number. The
        store checks your order and confirms delivery arrangements. Delivery
        time depends on the destination, courier availability and holidays.
      </p>
      <h2 className="text-2xl font-bold">Payment</h2>
      <p>
        Cash on Delivery is available. If a mobile payment option is shown at
        checkout, use only the displayed receiving number and enter your
        transaction reference. The store verifies prepaid payments before
        dispatch.
      </p>
      <h2 className="text-2xl font-bold">Tracking and order changes</h2>
      <p>
        Keep your order reference and receipt. Contact the store for a courier
        tracking code, cancellation request, address correction or delivery
        update. A saved order does not mean a courier has already collected it.
      </p>
      <h2 className="text-2xl font-bold">Damaged or incorrect goods</h2>
      <p>
        Contact the store with your order reference and details of the issue so
        it can review the delivery. Product warranty terms, where supplied,
        appear on the product page.
      </p>
      <Link className="sf-text-link" href="/contact">
        Contact the store
      </Link>
    </article>
  );
}
