import { Eye } from "lucide-react";

type AdminPayoutsPanelProps = {
  payoutCounts: { total: number; pending: number; completed: number };
  payoutsLoading: boolean;
  payoutEntries: any[];
  paginatedPayoutEntries: any[];
  openDetailModal: (payload: { title: string; entries: Array<{ label: string; value: string }> }) => void;
  payoutsCurrentPage: number;
  payoutsTotalPages: number;
  itemsPerPage: number;
  setPayoutsCurrentPage: (value: number | ((value: number) => number)) => void;
};

export default function AdminPayoutsPanel({
  payoutCounts,
  payoutsLoading,
  payoutEntries,
  paginatedPayoutEntries,
  openDetailModal,
  payoutsCurrentPage,
  payoutsTotalPages,
  itemsPerPage,
  setPayoutsCurrentPage,
}: AdminPayoutsPanelProps) {
  return (
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
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-center text-slate-500">
            <tr>
              <th className="px-4 py-3">Professional</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Paid At</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {payoutsLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-sm text-slate-500">Loading payments...</td>
              </tr>
            ) : payoutEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-sm text-slate-500">No payments yet.</td>
              </tr>
            ) : paginatedPayoutEntries.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-100 text-xs text-slate-700">
                <td className="px-4 py-3 align-middle text-center">
                  <div className="font-semibold text-slate-800">{entry.professionalName}</div>
                  <div className="text-xs text-slate-500">{entry.professionalEmail}</div>
                </td>
                <td className="px-4 py-3 align-middle text-center">{entry.plan}</td>
                <td className="px-4 py-3 align-middle text-center font-semibold text-slate-800">{entry.amount}</td>
                <td className="px-4 py-3 align-middle text-center text-xs text-slate-600">{entry.transactionId}</td>
                <td className="px-4 py-3 align-middle text-center">{entry.paidAt}</td>
                <td className="px-4 py-3 align-middle text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      entry.status === "completed"
                        ? "border border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]"
                        : "border border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-middle text-center">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        openDetailModal({
                          title: "Payout Details",
                          entries: [
                            { label: "Professional", value: entry.professionalName },
                            { label: "Email", value: entry.professionalEmail },
                            { label: "Plan", value: entry.plan },
                            { label: "Amount", value: entry.amount },
                            { label: "Transaction ID", value: entry.transactionId },
                            { label: "Paid At", value: entry.paidAt },
                            { label: "Status", value: entry.status },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {!payoutsLoading && payoutEntries.length > 0 ? (
          <div className="mt-4 flex justify-end px-4 pb-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPayoutsCurrentPage((page) => page - 1)}
                disabled={payoutsCurrentPage === 1}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Prev
              </button>
              {Array.from({ length: payoutsTotalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setPayoutsCurrentPage(page)}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                    page === payoutsCurrentPage
                      ? "border-[#178c43] bg-[#178c43] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPayoutsCurrentPage((page) => page + 1)}
                disabled={payoutsCurrentPage === payoutsTotalPages}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
