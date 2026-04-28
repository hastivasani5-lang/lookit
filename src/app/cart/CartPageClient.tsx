"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Script from "next/script";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCartItems, removeCartItem, updateCartItemQuantity, clearCartItems, type CartItem } from "@/lib/cart-store";

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
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  useEffect(() => {
    setCartItems(getCartItems());

    const handleStorage = () => setCartItems(getCartItems());
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + parsePrice(item.price) * (item.quantity ?? 1), 0),
    [cartItems],
  );

  const handleRemove = (itemId: string) => {
    setConfirmRemoveId(itemId);
  };

  const handleConfirmRemove = () => {
    if (confirmRemoveId) {
      setCartItems(removeCartItem(confirmRemoveId));
      setConfirmRemoveId(null);
    }
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    setCartItems(updateCartItemQuantity(itemId, newQty));
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

    // Card number: must be exactly 12 digits
    const rawCard = cardNumber.replace(/\s/g, "");
    if (!/^\d{12}$/.test(rawCard)) {
      setPaymentError("Card number must be exactly 12 digits.");
      return;
    }

    // Expiry: MM/YY format, YY >= 27, MM = valid future month
    const expiryParts = expiry.split("/");
    if (expiryParts.length !== 2) {
      setPaymentError("Please enter expiry in MM/YY format.");
      return;
    }
    const mm = parseInt(expiryParts[0], 10);
    const yy = parseInt(expiryParts[1], 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYY = now.getFullYear() % 100;
    if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) {
      setPaymentError("Please enter a valid expiry month (01–12).");
      return;
    }
    if (yy < 27) {
      setPaymentError("Expiry year must be 27 or later.");
      return;
    }
    if (yy === currentYY && mm < currentMonth) {
      setPaymentError("Expiry date cannot be in the past.");
      return;
    }

    // CVV: exactly 3 digits
    if (!/^\d{3}$/.test(cvv)) {
      setPaymentError("CVV must be exactly 3 digits.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch("/api/payments/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          items: cartItems,
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json().catch(() => ({}));
        setPaymentError(error.message || "Failed to create payment order.");
        setIsProcessingPayment(false);
        return;
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Lookit",
        description: `Purchase ${cartItems.length} item(s)`,
        order_id: orderData.orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            // Step 3: Verify payment and save to database
            const verifyResponse = await fetch("/api/payments/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: cartItems,
                cardName,
                cardNumber,
                expiry,
                cvv,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const payload = (await verifyResponse.json().catch(() => ({}))) as { message?: string };
            if (!verifyResponse.ok) {
              setPaymentSuccess(false);
              setPaymentError(payload.message || "Payment verification failed.");
              return;
            }

            setPaymentSuccessMessage(payload.message || "Payment successful!");
            setPaymentSuccess(true);
            clearCartItems();
            setCartItems([]);
          } catch (error) {
            setPaymentSuccess(false);
            setPaymentError("Payment verification failed.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#059669",
        },
      };

      // @ts-ignore - Razorpay is loaded via script
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setPaymentSuccess(false);
      setPaymentError("Unable to process payment.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
                        <div className="flex flex-col items-end gap-3">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 shadow-sm">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, (item.quantity ?? 1) - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-bold text-emerald-700 shadow transition hover:bg-emerald-100 hover:scale-110 disabled:opacity-40"
                              disabled={(item.quantity ?? 1) <= 1}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-base font-semibold text-gray-800">
                              {item.quantity ?? 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, (item.quantity ?? 1) + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-bold text-emerald-700 shadow transition hover:bg-emerald-100 hover:scale-110"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-gray-700">
                            Subtotal: <span className="text-emerald-700">₹{(parsePrice(item.price) * (item.quantity ?? 1)).toFixed(2)}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="inline-flex w-fit rounded-full bg-gradient-to-r from-red-100 to-rose-100 px-5 py-2 text-sm font-semibold text-red-700 shadow transition hover:bg-red-200 hover:scale-105"
                          >
                            Remove
                          </button>
                        </div>
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
                    {/* Card holder name */}
                    <input
                      type="text"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="Card holder name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-emerald-400 bg-white/80"
                    />

                    {/* Card number — exactly 12 digits, formatted as XXXX XXXX XXXX */}
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(event) => {
                        const digits = event.target.value.replace(/\D/g, "").slice(0, 12);
                        const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
                        setCardNumber(formatted);
                      }}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={14}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-emerald-400 bg-white/80 tracking-widest"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry — MM/YY, MM = current month onwards, YY = 27 onwards */}
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiry}
                        onChange={(event) => {
                          let val = event.target.value.replace(/\D/g, "").slice(0, 4);
                          if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                          setExpiry(val);
                        }}
                        onBlur={() => {
                          // Validate on blur
                          const parts = expiry.split("/");
                          if (parts.length !== 2) return;
                          const mm = parseInt(parts[0], 10);
                          const yy = parseInt(parts[1], 10);
                          const now = new Date();
                          const currentMonth = now.getMonth() + 1;
                          const currentYY = now.getFullYear() % 100;
                          if (
                            isNaN(mm) || isNaN(yy) ||
                            mm < 1 || mm > 12 ||
                            yy < 27 ||
                            (yy === currentYY && mm < currentMonth)
                          ) {
                            setExpiry("");
                          }
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-emerald-400 bg-white/80"
                      />

                      {/* CVV — exactly 3 digits */}
                      <input
                        type="password"
                        inputMode="numeric"
                        value={cvv}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
                          setCvv(digits);
                        }}
                        placeholder="CVV"
                        maxLength={3}
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

      {/* Remove confirmation modal */}
      {confirmRemoveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Item?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmRemoveId(null)}
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="flex-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:scale-105 hover:shadow-md"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}