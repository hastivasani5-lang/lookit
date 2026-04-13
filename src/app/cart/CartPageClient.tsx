"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCartItems, removeCartItem, type CartItem } from "@/lib/cart-store";

function parsePrice(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const amount = Number.parseFloat(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

export default function CartPageClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("Successful");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setCartItems(getCartItems());

    const handleStorage = () => setCartItems(getCartItems());
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const totalAmount = useMemo(() => cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0), [cartItems]);

  const handleRemove = (itemId: string) => {
    setCartItems(removeCartItem(itemId));
  };

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentError("");
    setPaymentSuccess(false);

    if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim() || cartItems.length === 0) {
      setPaymentSuccess(false);
      setPaymentError("Please complete all payment details.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          cardName,
          cardNumber,
          expiry,
          cvv,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        setPaymentSuccess(false);
        setPaymentError(payload.message || "Unable to process payment.");
        return;
      }

      setPaymentSuccessMessage(payload.message || "Successful");
      setPaymentSuccess(true);
    } catch {
      setPaymentSuccess(false);
      setPaymentError("Unable to process payment.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#edf4f2] px-4 pb-14 pt-28 md:px-8 lg:px-10">
        <section className="mx-auto w-full max-w-6xl">
          <div className="rounded-4xl border border-[#dbe8e4] bg-white p-6 shadow-[0_22px_45px_rgba(15,23,42,0.07)] md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cart</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Your Cart</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">Review the items you added and proceed to payment when you are ready.</p>
              </div>

              <div className="rounded-2xl bg-[#f7fbfa] px-4 py-3 text-right shadow-sm">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                Your cart is empty.
                <div className="mt-4">
                  <Link href="/professionals" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]">
                    Browse Professionals
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <article key={item.id} className="rounded-3xl border border-[#dbe8e4] bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{item.contentType}</p>
                          <h2 className="mt-1 text-lg font-semibold text-gray-900">{item.title}</h2>
                          <p className="mt-1 text-sm text-gray-600">{item.subtitle}</p>
                          <p className="mt-3 text-sm text-gray-500">Professional: {item.professionalName}</p>
                          <p className="text-sm font-semibold text-primary">{item.price}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="inline-flex w-fit rounded-full bg-[#fff1f1] px-4 py-2 text-sm font-semibold text-[#cc2a2a] transition hover:bg-[#ffe2e2]"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="rounded-3xl border border-[#dbe8e4] bg-white p-6 shadow-sm md:p-8">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Checkout</h2>
                  <p className="mt-2 text-sm text-gray-600">Proceed with payment for the items in your cart.</p>

                  <form onSubmit={handlePayment} className="mt-5 space-y-3">
                    <input
                      type="text"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="Card holder name"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                    />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="Card number"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(event) => setExpiry(event.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                      />
                      <input
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value)}
                        placeholder="CVV"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
                    >
                      {isProcessingPayment ? "Processing..." : "Pay Now"}
                    </button>

                    {paymentError ? (
                      <p className="rounded-xl bg-[#fff1f1] px-3 py-2 text-sm text-[#cc2a2a]">{paymentError}</p>
                    ) : null}

                    {paymentSuccess ? (
                      <div className="space-y-3 rounded-xl bg-[#e9f8f2] px-3 py-3 text-sm text-[#0f7a5c]">
                        <p>{paymentSuccessMessage}</p>
                        <Link
                          href="/dashboard/students/library"
                          className="inline-flex rounded-full bg-[#0f7a5c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d6a50]"
                        >
                          View Purchased Books
                        </Link>
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}