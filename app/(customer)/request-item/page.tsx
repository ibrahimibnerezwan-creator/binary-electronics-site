import { Metadata } from "next";
import { getPublicStoreSettings } from "@/lib/data";
import { ItemRequestForm } from "@/components/request/item-request-form";

export const metadata: Metadata = {
  title: "Send a photo of a part",
  description:
    "Can’t find a part on the website? Send the store a photo and we’ll check if we have it or can get it.",
  alternates: { canonical: "/request-item" },
};

export default async function RequestItemPage() {
  const settings = await getPublicStoreSettings();
  return (
    <section className="sf-wrap sf-page">
      <ItemRequestForm settings={settings} />
    </section>
  );
}
