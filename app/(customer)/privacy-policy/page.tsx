import Link from 'next/link'
export const metadata = { title: 'Privacy information' }
export default function PrivacyPage() {
  return <article className="container mx-auto max-w-3xl px-4 pt-32 pb-20 space-y-8">
    <h1 className="text-4xl font-bold">Privacy information</h1>
    <h2 className="text-2xl font-bold">Information you provide</h2><p>Account registration stores your name, email, phone number and a hashed password. Orders store your contact details, delivery address, items, totals and payment reference when supplied. Enquiries, newsletter subscriptions and product reviews store the information you submit.</p>
    <h2 className="text-2xl font-bold">How it is used</h2><p>The store uses this information to manage accounts, process orders, verify payment references and respond to enquiries. Delivery details are shared with the selected courier when the store books a shipment. Hosting and database services process data needed to operate this website. Approved reviews and store replies are public.</p>
    <h2 className="text-2xl font-bold">Browser storage</h2><p>Session and receipt cookies control access to your account and order receipt. Your cart and saved products are stored in this browser. Request counters use hashed network addresses to limit abuse of forms and sign-in attempts.</p>
    <h2 className="text-2xl font-bold">Your requests</h2><p>Contact the store to request an account correction, removal of information or newsletter unsubscribe. Include enough information to identify the record. Order records may need to be retained to handle fulfilment, warranty or legal obligations. Do not send passwords, mobile-wallet PINs or one-time codes.</p>
    <Link className="text-primary-500 underline" href="/contact">Contact the store about your information</Link>
  </article>
}
