"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCartItems, removeCartItem, type CartItem } from "@/lib/cart-store";

const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@jenildineshbhaigadhiya";

function parsePrice(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const amount = Number.parseFloat(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

export default function CartPageClient() {
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const isLoggedIn = !!session?.user?.id;
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

    window.open(RAZORPAY_PAYMENT_LINK, "_blank", "noopener,noreferrer");

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
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-2 pb-16 pt-10 md:px-8 lg:px-10">
          <section className="w-full max-w-screen-2xl mx-auto px-2 md:px-8">
            <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-emerald-100 p-2 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-emerald-100 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Cart</p>
                <h1 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl drop-shadow-sm">Your Cart</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">Review your items and checkout securely.</p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-4 text-right shadow-md">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-2xl font-bold text-emerald-700">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center text-base text-gray-600 shadow-inner">
                <span className="block text-4xl mb-2">🛒</span>
                Your cart is empty.
                <div className="mt-6">
                  <Link href="/professionals" className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-base font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg">
                    Browse Professionals
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md hover:shadow-lg transition-all">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">{item.contentType}</p>
                          <h2 className="mt-1 text-lg font-bold text-gray-900">{item.title}</h2>
                          <p className="mt-1 text-sm text-gray-600">{item.subtitle}</p>
                          <p className="mt-3 text-sm text-gray-500">Professional: <span className="font-semibold text-emerald-700">{item.professionalName}</span></p>
                          <p className="mt-2 text-base font-bold text-emerald-700">{item.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="inline-flex w-fit rounded-full bg-gradient-to-r from-red-100 to-rose-100 px-5 py-2 text-sm font-semibold text-red-700 shadow transition hover:bg-red-200 hover:scale-105"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Checkout</h2>
                  <p className="mb-4 text-sm text-gray-600">Securely pay for your items below.</p>

                  {!isLoggedIn ? (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-800">
                      <p className="font-semibold">Please log in to checkout</p>
                      <Link href="/login" className="mt-2 inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105">
                        Log In
                      </Link>
                    </div>
                  ) : !isStudent ? (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-800">
                      <p className="font-semibold">Student account required</p>
                      <p className="mt-1 text-xs">Only students can purchase books and videos. Please log in with a student account.</p>
                      <Link href="/login" className="mt-3 inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105">
                        Switch Account
                      </Link>
                    </div>
                  ) : (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <input
                      type="text"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="Card holder name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-emerald-400 bg-white/80"
                    />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="Card number"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-emerald-400 bg-white/80"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(event) => setExpiry(event.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-emerald-400 bg-white/80"
                      />
                      <input
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value)}
                        placeholder="CVV"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-emerald-400 bg-white/80"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:opacity-60"
                    >
                      {isProcessingPayment ? "Processing..." : "Pay Now"}
                    </button>

                    {paymentError ? (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-700 shadow-inner">{paymentError}</p>
                    ) : null}

                    {paymentSuccess ? (
                      <div className="space-y-3 rounded-xl bg-emerald-50 px-4 py-4 text-base text-emerald-700 shadow-inner">
                        <p>{paymentSuccessMessage}</p>
                        <Link
                          href="/dashboard/students/library"
                          className="inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-base font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                        >
                          View Purchased Books
                        </Link>
                      </div>
                    ) : null}
                  </form>
                  )}
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