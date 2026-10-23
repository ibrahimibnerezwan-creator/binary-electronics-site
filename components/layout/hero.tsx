import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Cpu, Truck, Wallet, MessageCircle } from "lucide-react";

export function Hero() {
  return (
    <section
      className="sf-hero sf-wrap"
      aria-label="Welcome to Binary Electronics"
    >
      <div className="sf-hero-grid">
        <div className="sf-hero-copy">
          <span className="sf-hero-tag">
            <Cpu size={17} /> Modern Electronics & Robotics Solutions
          </span>
          <h1>
            Power your
            <br />
            next idea.
          </h1>
          <p>
            From robotics and automation components to power supplies and ICs.
            Find the right electronics to bring your next project to life.
          </p>
          <div className="sf-hero-actions">
            <Link href="/categories" className="sf-btn">
              Explore categories <ArrowUpRight size={17} />
            </Link>
            <Link href="/products" className="sf-text-link">
              Shop all products
            </Link>
          </div>
        </div>
        <div className="sf-hero-image">
          <Image
            src="/images/hero-robotics.png"
            alt="Robotic hand clasping human hand representing modern electronics, robotics and technology"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="sf-hero-caption">
            <div>
              <strong>Innovation in your hands.</strong>
              <span>Explore robotics & electronic components</span>
            </div>
            <Link
              href="/categories"
              aria-label="Explore categories"
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
