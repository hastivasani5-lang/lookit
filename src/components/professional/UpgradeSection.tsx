"use client";
import React from "react";
import { CreditCard, ChevronRight } from "lucide-react";
import UpgradeTimeline from "@/components/UpgradeTimeline";
import { upgradePlans, RAZORPAY_PAYMENT_LINK, type UpgradePlanKey, type DashboardSection } from "@/components/professional/DashboardTypes";

type UpgradeSectionProps = {
  upgradePlan: UpgradePlanKey;
  setUpgradePlan: (plan: UpgradePlanKey) => void;
  profileBoostedUntil: string | null;
  hasOpenedRazorpay: boolean;
  setHasOpenedRazorpay: (v: boolean) => void;
  processingUpgrade: boolean;
  profileError: string;
  profileMessage: string;
  handleUpgradeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleOpenRazorpay: () => void;
  setActiveSection: (s: DashboardSection) => void;
};

export default function UpgradeSection({
  upgradePlan,
  setUpgradePlan,
  profileBoostedUntil,
  hasOpenedRazorpay,
  setHasOpenedRazorpay,
  processingUpgrade,
  profileError,
  profileMessage,
  handleUpgradeSubmit,
  handleOpenRazorpay,
}: UpgradeSectionProps) {
  return (
    <div className="mt-6 space-y-8">

      {/* ── Status banner if already boosted ── */}
      {profileBoostedUntil && (
        <div className="flex items-center gap-4 rounded-2xl border border-[#1ec28e]/30 bg-[#effaf6] px-5 py-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1ec28e]/20 text-[#1ec28e]">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Profile Boost Active</p>
            <p className="text-xs text-slate-500">Active until {new Date(profileBoostedUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <span className="rounded-full bg-[#1ec28e] px-3 py-1 text-xs font-bold text-white">Live</span>
        </div>
      )}

      {/* ── Section heading ── */}
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1ec28e]">Upgrade Profile</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Choose Your Boost Plan</h2>
        <p className="mt-2 text-sm text-slate-500">Rank higher than other professionals. Pay once, boost your visibility.</p>
      </div>

      {/* ── Pricing cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {upgradePlans.map((plan) => {
          const isSelected = upgradePlan === plan.key;
          const isPro = plan.key === "pro";
          const features: Record<string, string[]> = {
            starter: ["1 week boost", "Higher ranking", "Boost badge", "Priority visibility"],
            pro: ["1 month boost", "Higher ranking", "Boost badge", "Priority visibility", "Featured listing"],
            premium: ["2 months boost", "Higher ranking", "Boost badge", "Priority visibility", "Featured listing", "Top search results"],
            elite: ["3 months boost", "Higher ranking", "Boost badge", "Priority visibility", "Featured listing", "Top search results", "Dedicated support"],
          };
          return (
            <div
              key={plan.key}
              onClick={() => { setUpgradePlan(plan.key); setHasOpenedRazorpay(false); }}
              className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                isSelected
                  ? "border-[#1ec28e] bg-[#1ec28e] text-white shadow-xl scale-[1.02]"
                  : "border-slate-200 bg-white hover:border-[#1ec28e]/50 hover:shadow-md"
              }`}
            >
              {isPro && !isSelected && (
                <div className="absolute -right-0 -top-0 overflow-hidden rounded-tr-2xl" style={{ width: 56, height: 56 }}>
                  <div className="absolute right-[-14px] top-[10px] w-[72px] rotate-45 bg-[#1ec28e] py-1 text-center text-[10px] font-bold text-white">New</div>
                </div>
              )}
              <p className={`text-xs font-bold uppercase tracking-widest ${isSelected ? "text-white/80" : "text-[#1ec28e]"}`}>
                {plan.name}
              </p>
              <div className="mt-3 flex items-end gap-1">
                <span className={`text-4xl font-extrabold ${isSelected ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                <span className={`mb-1 text-sm ${isSelected ? "text-white/70" : "text-slate-400"}`}>/ boost</span>
              </div>
              <p className={`mt-1 text-xs ${isSelected ? "text-white/70" : "text-slate-400"}`}>{plan.duration}</p>
              <ul className="mt-5 space-y-2">
                {features[plan.key].map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-xs ${isSelected ? "text-white/90" : "text-slate-600"}`}>
                    <svg className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-[#1ec28e]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setUpgradePlan(plan.key); setHasOpenedRazorpay(false); handleOpenRazorpay(); }}
                className={`mt-6 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                  isSelected
                    ? "bg-white text-[#1ec28e] hover:bg-white/90"
                    : "border border-[#1ec28e] bg-white text-[#1ec28e] hover:bg-[#1ec28e] hover:text-white"
                }`}
              >
                {isSelected ? "Pay Now" : "Buy Now"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Payment confirmation form ── */}
      <form onSubmit={handleUpgradeSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#effaf6] text-[#1ec28e]">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Confirm Payment</h3>
            <p className="text-xs text-slate-500">Selected: <span className="font-semibold text-[#1ec28e]">{upgradePlans.find((p) => p.key === upgradePlan)?.name} — {upgradePlans.find((p) => p.key === upgradePlan)?.price}</span></p>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-700">How to pay:</p>
          <ol className="mt-2 space-y-1 text-xs text-slate-500 list-decimal list-inside">
            <li>Click <strong className="text-slate-700">&quot;Open Razorpay&quot;</strong> below to open the payment link</li>
            <li>Complete the payment on Razorpay</li>
            <li>Come back and click <strong className="text-slate-700">&quot;Confirm Payment&quot;</strong></li>
          </ol>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleOpenRazorpay}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1ec28e] px-5 text-sm font-bold text-white transition hover:bg-[#17a87a]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Razorpay
          </button>
          <a href={RAZORPAY_PAYMENT_LINK} target="_blank" rel="noopener noreferrer"
            className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline truncate max-w-[200px]">
            {RAZORPAY_PAYMENT_LINK}
          </a>
        </div>
        {profileError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>
        )}
        {profileMessage && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</div>
        )}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={processingUpgrade}
            className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-[#1ec28e] bg-white px-5 text-sm font-bold text-[#1ec28e] transition hover:bg-[#effaf6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processingUpgrade ? "Confirming..." : "Confirm Payment"}
          </button>
          <span className="text-xs text-slate-400">
            {hasOpenedRazorpay ? "✓ Payment link opened — confirm after paying." : "Open Razorpay link first."}
          </span>
        </div>
      </form>

      {/* ── Upgrade timeline if active ── */}
      {profileBoostedUntil && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h4 className="text-base font-bold text-slate-900">Boost Timeline</h4>
          <p className="mt-1 text-sm text-slate-500">Live remaining duration for your active profile boost.</p>
          <UpgradeTimeline boostedUntil={profileBoostedUntil} />
        </div>
      )}
    </div>
  );
}
