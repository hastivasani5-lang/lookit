"use client";

import { ChevronRight, CreditCard } from "lucide-react";
import UpgradeTimeline from "@/components/UpgradeTimeline";
import { UpgradePlanKey, upgradePlans, RAZORPAY_PAYMENT_LINK } from "./types";

type Props = {
  upgradePlan: UpgradePlanKey;
  setUpgradePlan: (plan: UpgradePlanKey) => void;
  profileBoostedUntil: string | null;
  profileError: string;
  profileMessage: string;
  processingUpgrade: boolean;
  hasOpenedRazorpay: boolean;
  handleOpenRazorpay: () => void;
  handleUpgradeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setHasOpenedRazorpay: (v: boolean) => void;
};

export default function DashboardUpgradeSection({
  upgradePlan, setUpgradePlan, profileBoostedUntil, profileError, profileMessage,
  processingUpgrade, hasOpenedRazorpay, handleOpenRazorpay, handleUpgradeSubmit, setHasOpenedRazorpay,
}: Props) {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleUpgradeSubmit} className="rounded-[24px] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Upgrade Profile</h3>
              <p className="text-sm text-slate-500">Pay with Razorpay to rank higher than other professionals.</p>
            </div>
            <CreditCard className="h-5 w-5 text-[#1ec28e]" />
          </div>

          <div className="mt-6 rounded-2xl bg-[#f7faf8] p-4">
            <p className="text-sm font-semibold text-slate-900">Selected plan</p>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{upgradePlans.find((p) => p.key === upgradePlan)?.name}</p>
                <p className="text-sm text-slate-500">{upgradePlans.find((p) => p.key === upgradePlan)?.duration}</p>
              </div>
              <p className="text-lg font-semibold text-[#1ec28e]">{upgradePlans.find((p) => p.key === upgradePlan)?.price}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Cardholder name
              <input type="text" placeholder="Name on card" className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <input type="text" placeholder="Card number" className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
            <input type="text" placeholder="MM/YY" className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
            <input type="text" placeholder="CVC" className="h-12 w-full rounded-full border border-slate-200 px-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1ec28e]" />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Razorpay payment</p>
            <p className="mt-1 text-xs text-slate-500">Open payment link, complete payment, then confirm below.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={handleOpenRazorpay} className="inline-flex h-10 items-center rounded-full bg-[#1ec28e] px-4 text-sm font-medium text-white transition hover:bg-[#18ab7d]">Pay Now</button>
              <a href={RAZORPAY_PAYMENT_LINK} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline">{RAZORPAY_PAYMENT_LINK}</a>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#f7faf8] p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">What you get</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Higher ranking in professional listings</li>
              <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Boost badge on your profile</li>
              <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-[#1ec28e]" />Priority visibility for clients</li>
            </ul>
          </div>

          {profileError && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>}
          {profileMessage && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</div>}

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" disabled={processingUpgrade} className="inline-flex h-12 items-center gap-2 rounded-full border border-[#1ec28e] bg-white px-5 text-sm font-medium text-[#1ec28e] transition hover:bg-[#effaf6] disabled:cursor-not-allowed disabled:opacity-70">
              <CreditCard className="h-4 w-4" />
              {processingUpgrade ? "Confirming..." : "Confirm Payment"}
            </button>
            <span className="text-xs text-slate-500">{hasOpenedRazorpay ? "Payment link opened. After payment, click Confirm Payment." : "Open Razorpay link first."}</span>
          </div>
        </form>

        <aside className="rounded-[24px] bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900">Upgrade summary</h4>
          <p className="mt-2 text-sm text-slate-500">Your profile is currently visible as a standard professional profile.</p>
          <div className="mt-5 grid gap-3">
            {upgradePlans.map((plan) => (
              <button key={plan.key} type="button" onClick={() => { setUpgradePlan(plan.key); setHasOpenedRazorpay(false); }} className={`rounded-2xl border p-4 text-left transition ${upgradePlan === plan.key ? "border-[#1ec28e] bg-[#effaf6]" : "border-slate-200 bg-white hover:border-[#1ec28e]/40 hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{plan.name}</p>
                    <p className="text-sm text-slate-500">{plan.duration}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#1ec28e]">{plan.price}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-slate-100 bg-[#f7faf8] p-4">
            <p className="text-sm font-semibold text-slate-900">Boost status</p>
            <p className="mt-2 text-sm text-slate-600">{profileBoostedUntil ? `Active until ${new Date(profileBoostedUntil).toLocaleDateString()}` : "Not upgraded yet"}</p>
          </div>
          <div className="mt-4 rounded-2xl bg-[#effaf6] p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Ranking benefit</p>
            <p className="mt-2">Upgraded profiles appear higher than standard professionals in search and discovery lists.</p>
          </div>
        </aside>
      </div>

      {profileBoostedUntil && (
        <div className="rounded-[24px] bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-900">Upgrade timeline</h4>
          <p className="mt-1 text-sm text-slate-500">Live remaining duration for your active profile boost.</p>
          <UpgradeTimeline boostedUntil={profileBoostedUntil} />
        </div>
      )}
    </div>
  );
}
