import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sun, Truck, Wallet, MessageCircle } from "lucide-react";

export function Hero() {
  return (
    <section
      className="sf-hero sf-wrap"
      aria-label="Welcome to Binary Electronics"
    >
      <div className="sf-hero-grid">
        <div className="sf-hero-copy">
          <span className="sf-hero-tag">
            <Sun size={17} /> A little power. A lot of possibility.
          </span>
          <h1>
            Power your
            <br />
            next idea.
          </h1>
          <p>
            From solar charge controllers to everyday power supplies. Find the
            right electronics to bring your next project to life.
          </p>
          <div className="sf-hero-actions">
            <Link href="/products" className="sf-btn">
              Shop all products <ArrowUpRight size={17} />
            </Link>
            <Link href="/categories" className="sf-text-link">
              Explore categories
            </Link>
          </div>
        </div>
        <div className="sf-hero-image">
          <Image
            src="/images/solar-energy.jpg"
            alt="Solar panels collecting energy beneath a blue sky"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="sf-hero-caption">
            <div>
              <strong>More from every ray.</strong>
              <span>Explore solar charge controllers</span>
            </div>
            <Link
              href="/products?q=controller"
              aria-label="Shop solar charge controllers"
            >
              <ArrowUpRight size={23} />
            </Link>
          </div>
        </div>
      </div>
      <div className="sf-benefits">
        <div className="sf-benefit">
          <Truck size={27} strokeWidth={1.5} />
          <div>
            <strong>Delivery across Bangladesh</strong>
            <p>Delivery charges shown at checkout</p>
          </div>
        </div>
        <div className="sf-benefit">
          <Wallet size={27} strokeWidth={1.5} />
          <div>
            <strong>Cash on delivery</strong>
            <p>Pay when your order arrives</p>
          </div>
        </div>
        <div className="sf-benefit">
          <MessageCircle size={27} strokeWidth={1.5} />
          <div>
            <strong>Have a product question?</strong>
            <p>
              <Link href="/contact">Talk to the store before you order</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
