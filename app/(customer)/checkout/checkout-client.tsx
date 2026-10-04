"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { deliverySettings, orderTotals, normalizePhone } from "@/lib/commerce";
import { placeOrder } from "./actions";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

interface Settings {
  [key: string]: string;
}

interface User {
  id: string;
  name: string;
}

export default function CheckoutClient({
  settings,
  user,
}: {
  settings: Settings;
  user?: User | null;
}) {
  const { cart, cartTotal, clearCart, ready, syncError } = useCart();
  const router = useRouter();

  const requestId = useRef("");
  const submitting = useRef(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerPhone: "",
    address: "",
    shippingCity: "Dhaka",
    paymentMethod: "cod",
    transactionId: "",
  });

  const rates = deliverySettings(settings);
  const sInside = rates.inside;
  const sOutside = rates.outside;
  const {
    shipping: shippingCost,
    tax,
    total: finalTotal,
  } = orderTotals(cartTotal, formData.shippingCity, settings);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const nextStep = () => {
    if (cart.some((item) => !item.stock || item.quantity > item.stock)) {
      setError("Stock has changed. Update your cart before continuing.");
      return;
    }
    if (step === 1) {
      if (
        !formData.customerName.trim() ||
        !formData.customerPhone.trim() ||
        !formData.address.trim()
      ) {
        setError("Please fill out all shipping fields.");
        return;
      }
    }
    if (step === 1) {
      try {
        normalizePhone(formData.customerPhone);
      } catch {
        setError("Enter a valid Bangladesh mobile number.");
        return;
      }
    }
    if (step === 2) {
      if (formData.paymentMethod !== "cod" && !formData.transactionId) {
        setError("Please provide the Transaction ID for your payment.");
        return;
      }
    }
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
    setError(null);
  };

  const prevStep = () => {
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
    setError(null);
  };

  const handleSubmit = async () => {
    if (submitting.current || !ready || syncError) return;
    if (cart.some((item) => !item.stock || item.quantity > item.stock)) {
      setError("Stock has changed. Update your cart before placing the order.");
      return;
    }
    submitting.current = true;
    setIsLoading(true);
    setError(null);
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const result = await placeOrder({
        ...formData,
        requestId: requestId.current,
        items: cart.map((i) => ({ id: i.id, quantity: i.quantity })),
        total: finalTotal,
      });
      if (result.error) setError(result.error);
      else if ("orderId" in result) {
        clearCart();
        router.push(`/order-confirmation/${result.orderId}`);
      }
    } catch {
      setError("Connection failed. Your cart is saved. Please try again.");
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };

  if (!ready)
    return (
      <p role="status" className="sf-results-note">
        Checking current prices and stock…
      </p>
    );
  if (syncError)
    return (
      <div role="alert" className="sf-error">
        <p>{syncError}</p>
        <button className="sf-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  if (!cart.length)
    return (
      <div className="sf-empty">
        <ShoppingBag size={38} />
        <h2>Your cart is empty</h2>
        <p>Add a product before checking out.</p>
        <button className="sf-btn" onClick={() => router.push("/products")}>
          Browse products
        </button>
      </div>
    );
  const paymentNames: Record<string, string> = {
    cod: "Cash on delivery",
    bkash: "bKash",
    nagad: "Nagad",
  };
  return (
    <div className="sf-checkout-grid">
      <div>
        <ol className="sf-checkout-steps" aria-label="Checkout progress">
          {["Delivery", "Payment", "Review"].map((label, index) => (
            <li
              key={label}
              aria-current={step === index + 1 ? "step" : undefined}
              className={step >= index + 1 ? "is-active" : ""}
            >
              <span>
                {step > index + 1 ? <CheckCircle2 size={16} /> : index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
        {error && (
          <div role="alert" className="sf-error">
            {error}
          </div>
        )}
        <div className="sf-checkout-panel">
          {step === 1 && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                nextStep();
              }}
              className="sf-form"
            >
              <h2>Delivery details</h2>
              <div className="sf-form-pair">
                <label className="sf-field" htmlFor="customerName">
                  Full name
                  <input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    autoComplete="name"
                    required
                    placeholder="Your full name"
                  />
                </label>
                <label className="sf-field" htmlFor="customerPhone">
                  Phone number
                  <input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    required
                    placeholder="01XXXXXXXXX"
                  />
                </label>
              </div>
              <label className="sf-field" htmlFor="address">
                Delivery address
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  autoComplete="street-address"
                  required
                  placeholder="House, road, area and district"
                />
              </label>
              <label className="sf-field" htmlFor="shippingCity">
                City / region
                <select
                  id="shippingCity"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleInputChange}
                >
                  <option value="Dhaka">Dhaka City (৳{sInside})</option>
                  <option value="Outside Dhaka">
                    Outside Dhaka (৳{sOutside})
                  </option>
                </select>
              </label>
              <div className="sf-checkout-actions">
                <button className="sf-btn" type="submit">
                  Continue to payment <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                nextStep();
              }}
              className="sf-form"
            >
              <h2>How would you like to pay?</h2>
              <fieldset className="sf-payment-methods">
                <legend className="sr-only">Payment method</legend>
                {["cod", "bkash", "nagad"]
                  .filter(
                    (method) =>
                      method === "cod" || settings[`${method}_number`]?.trim(),
                  )
                  .map((method) => (
                    <label
                      key={method}
                      className={
                        formData.paymentMethod === method ? "is-selected" : ""
                      }
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleInputChange}
                      />
                      {method === "cod" ? (
                        <Truck size={20} />
                      ) : (
                        <CreditCard size={20} />
                      )}
                      <span>{paymentNames[method]}</span>
                    </label>
                  ))}
              </fieldset>
              {formData.paymentMethod === "cod" ? (
                <div className="sf-payment-note">
                  <Truck size={24} />
                  <div>
                    <strong>Pay when your order arrives.</strong>
                    <p>
                      Your total is {formatPrice(finalTotal)}, including
                      delivery and VAT. The store will confirm delivery
                      arrangements.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="sf-prepaid-details">
                  <h3>
                    {paymentNames[formData.paymentMethod]} payment details
                  </h3>
                  <p>
                    Use the {paymentNames[formData.paymentMethod]} app to send{" "}
                    {formatPrice(finalTotal)} to the receiving number below.
                  </p>
                  <strong className="sf-payment-number">
                    {settings[`${formData.paymentMethod}_number`]}
                  </strong>
                  <p>
                    The store manually verifies your transaction before
                    dispatch.
                  </p>
                  <label className="sf-field" htmlFor="transactionId">
                    Transaction ID
                    <input
                      id="transactionId"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your transaction reference"
                      autoComplete="off"
                    />
                  </label>
                </div>
              )}
              <div className="sf-checkout-actions">
                <button
                  type="button"
                  className="sf-btn sf-btn-secondary"
                  onClick={prevStep}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="sf-btn">
                  Review order <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <div className="sf-form">
              <h2>Review your order</h2>
              <p className="sf-results-note">
                Check your details before placing the order.
              </p>
              <div className="sf-review-order">
                <div>
                  <h3>Deliver to</h3>
                  <strong>{formData.customerName}</strong>
                  <p>{formData.customerPhone}</p>
                  <p>
                    {formData.address}, {formData.shippingCity}
                  </p>
                </div>
                <div>
                  <h3>Payment method</h3>
                  <strong>{paymentNames[formData.paymentMethod]}</strong>
                  {formData.transactionId && (
                    <p>Transaction ID: {formData.transactionId}</p>
                  )}
                </div>
              </div>
              <div className="sf-checkout-actions">
                <button
                  type="button"
                  className="sf-btn sf-btn-secondary"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  className="sf-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Placing
                      order…
                    </>
                  ) : (
                    "Place order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <aside className="sf-cart-summary sf-checkout-summary">
        <h2>Your order</h2>
        <div className="sf-checkout-items">
          {cart.map((item) => (
            <div key={item.id} className="sf-checkout-item">
              <div className="sf-checkout-image">
                <Image src={item.image} alt={item.name} fill sizes="64px" />
              </div>
              <div>
                <strong>{item.name}</strong>
                <p>Quantity: {item.quantity}</p>
              </div>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="sf-summary-row">
          <span>Subtotal</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </div>
        <div className="sf-summary-row">
          <span>Delivery</span>
          <strong>{formatPrice(shippingCost)}</strong>
        </div>
        <div className="sf-summary-row">
          <span>VAT ({settings.vat_percentage || "0"}%)</span>
          <strong>{formatPrice(tax)}</strong>
        </div>
        <div className="sf-summary-row sf-summary-total">
          <span>Total</span>
          <strong>{formatPrice(finalTotal)}</strong>
        </div>
        <p>
          Need to change your items?{" "}
          <a href="/cart" className="sf-text-link">
            Edit cart
          </a>
        </p>
      </aside>
    </div>
  );
}
