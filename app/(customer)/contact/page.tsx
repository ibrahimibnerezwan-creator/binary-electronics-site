import { Metadata } from "next";
import { getPublicStoreSettings } from "@/lib/data";
import { ContactForm } from "@/components/contact/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicStoreSettings();
  const storeName = settings.storeName || "Binary Electronics";

  return {
    title: `Contact | ${storeName}`,
    description: `Get in touch with ${storeName} team for product questions and order enquiries.`,
  };
}

export default async function ContactPage() {
  const settings = await getPublicStoreSettings();

  return (
    <section className="sf-wrap sf-page">
      <ContactForm settings={settings} />
    </section>
  );
}
