import { getPublicStoreSettings } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import CheckoutClient from "./checkout-client";
export const dynamic = "force-dynamic";
export default async function CheckoutPage() {
  const [settings, user] = await Promise.all([
    getPublicStoreSettings(),
    getCurrentUser(),
  ]);
  return (
    <section className="sf-wrap sf-page">
      <div className="sf-page-head">
        <h1>Just a few details.</h1>
        <p>Choose where to send your order and how you’d like to pay.</p>
      </div>
      <CheckoutClient settings={settings} user={user} />
    </section>
  );
}
