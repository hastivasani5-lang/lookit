import React from "react";
import NeumorphListCard from "./NeumorphListCard";

interface PayoutEntry {
  id: number;
  professionalName: string;
  professionalEmail: string;
  plan: string;
  amount: string;
  transactionId: string;
  paidAt: string;
  status: string;
}

interface PayoutsListProps {
  payoutEntries: PayoutEntry[];
}

const PayoutsList: React.FC<PayoutsListProps> = ({ payoutEntries }) => (
  <ul className="flex flex-col gap-3">
    {payoutEntries.map((entry) => (
      <NeumorphListCard key={entry.id}>
        <div className="flex-1 min-w-[120px] font-medium text-slate-800">{entry.professionalName}
          <div className="text-xs text-slate-500">{entry.professionalEmail}</div>
        </div>
        <div className="flex-1 min-w-[120px] text-slate-700">{entry.plan}</div>
        <div className="flex-1 min-w-[80px] font-semibold text-slate-800">{entry.amount}</div>
        <div className="flex-1 min-w-[120px] text-xs text-slate-600">{entry.transactionId}</div>
        <div className="flex-1 min-w-[120px] text-slate-700">{entry.paidAt}</div>
        <div className="flex-1 min-w-[100px]">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            entry.status === "completed"
              ? "border border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]"
              : "border border-amber-200 bg-amber-50 text-amber-700"
          }`}>
            {entry.status}
          </span>
        </div>
        <div className="flex flex-1 justify-end min-w-[80px]">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            View
          </span>
        </div>
      </NeumorphListCard>
    ))}
  </ul>
);

export default PayoutsList;
