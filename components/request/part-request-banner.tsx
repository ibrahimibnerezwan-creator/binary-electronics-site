import Link from "next/link";
import { Camera } from "lucide-react";

// Sits under product lists. Appears once per page (the heading id is fixed).
export function PartRequestBanner() {
  return (
    <aside className="sf-request-banner" aria-labelledby="part-request-title">
      <Camera size={30} strokeWidth={1.5} aria-hidden="true" />
      <div>
        <h2 id="part-request-title">Can’t find the part you need?</h2>
        <p>
          Send us a photo and we’ll check if we have it or can get it. <span lang="bn">ওয়েবসাইটে না পেলে ছবি পাঠান।</span>
        </p>
      </div>
      <Link href="/request-item" prefetch={false} className="sf-btn">
        Send a photo
      </Link>
    </aside>
  );
}
