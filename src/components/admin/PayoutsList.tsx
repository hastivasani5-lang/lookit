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


import { useState } from "react";

const PayoutsList: React.FC<PayoutsListProps> = ({ payoutEntries }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(payoutEntries.length / itemsPerPage);
  const paginated = payoutEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {paginated.map((entry) => (
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
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#e8f9ee] text-[#178c43]" : "bg-slate-100 text-slate-700"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50">Next</button>
        </div>
      )}
    </>
  );
};

export default PayoutsList;
