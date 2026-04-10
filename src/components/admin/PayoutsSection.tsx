import React from "react";
import PayoutsList from "./PayoutsList";

interface PayoutsSectionProps {
  payoutEntries: any[];
  payoutCounts: { total: number; pending: number; completed: number };
}

const PayoutsSection: React.FC<PayoutsSectionProps> = ({ payoutEntries, payoutCounts }) => (
  <div className="mt-6 space-y-4">
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Total Payments</p>
        <p className="mt-1 text-2xl font-semibold text-slate-800">{payoutCounts.total}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Pending</p>
        <p className="mt-1 text-2xl font-semibold text-amber-600">{payoutCounts.pending}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Completed</p>
        <p className="mt-1 text-2xl font-semibold text-[#178c43]">{payoutCounts.completed}</p>
      </div>
    </div>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <PayoutsList payoutEntries={payoutEntries} />
    </div>
  </div>
);

export default PayoutsSection;
