import { Eye } from "lucide-react";

type AdminApprovalsPanelProps = {
  approvalCounts: { total: number; pending: number; approved: number; rejected: number };
  paginatedApprovalRequests: any[];
  approvalStatusStyles: Record<string, { row: string; pill: string; label: string }>;
  updateApprovalStatus: (id: string, status: "approved" | "rejected") => void;
  openDetailModal: (payload: { title: string; entries: Array<{ label: string; value: string }> }) => void;
  approvalRequests: any[];
  approvalsCurrentPage: number;
  itemsPerPage: number;
  approvalTotalPages: number;
  setApprovalsCurrentPage: (value: number | ((value: number) => number)) => void;
};

export default function AdminApprovalsPanel({
  approvalCounts,
  paginatedApprovalRequests,
  approvalStatusStyles,
  updateApprovalStatus,
  openDetailModal,
  approvalRequests,
  approvalsCurrentPage,
  itemsPerPage,
  approvalTotalPages,
  setApprovalsCurrentPage,
}: AdminApprovalsPanelProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-sm text-slate-500">Total Requests</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{approvalCounts.total}</p>
        </div>
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{approvalCounts.pending}</p>
        </div>
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-[#178c43]">{approvalCounts.approved}</p>
        </div>
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-[#cc2a2a]">{approvalCounts.rejected}</p>
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-base font-semibold text-slate-700">Professional Requests</h2>

      <div className="-mx-4 overflow-x-auto sm:-mx-5">
        <div className="min-w-[700px] px-4 sm:px-5">
          <ul className="flex flex-col gap-3">
            {paginatedApprovalRequests.map((request) => {
              const statusStyle = approvalStatusStyles[request.status];
              return (
                <li key={request.id} className="w-full">
                  <div className={`flex items-center gap-4 rounded-2xl neumorph-admin-card p-4 shadow-[4px_4px_16px_#d0dbd6,-4px_-4px_16px_#ffffff] ${statusStyle.row}`}>
                  <div className="w-32 shrink-0 font-medium text-slate-800">{request.name}</div>
                  <div className="w-32 shrink-0 text-slate-700 text-sm">{request.specialization || "-"}</div>
                  <div className="w-24 shrink-0 text-slate-700 text-sm">{request.updated}</div>
                  <div className="w-24 shrink-0">
                    <span className={`inline-flex w-full items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle.pill}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => updateApprovalStatus(request.id, "approved")}
                      className="rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#178c43] transition hover:bg-[#dff6e8] whitespace-nowrap"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateApprovalStatus(request.id, "rejected")}
                      className="rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc] whitespace-nowrap"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openDetailModal({
                          title: "Approval Request Details",
                          entries: [
                            { label: "Name", value: request.name },
                            { label: "Type", value: request.specialization },
                            { label: "Updated", value: request.updated },
                            { label: "Status", value: request.status },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 whitespace-nowrap"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </div>
                  </div>
                </li>
              );
            })}

            {approvalRequests.length === 0 ? (
              <li className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No approval requests found.</li>
            ) : null}
          </ul>
        </div>
      </div>

      {approvalRequests.length > 0 ? (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setApprovalsCurrentPage((page) => page - 1)}
              disabled={approvalsCurrentPage === 1}
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Prev
            </button>
            {Array.from({ length: approvalTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setApprovalsCurrentPage(page)}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  page === approvalsCurrentPage
                    ? "border-[#178c43] bg-[#178c43] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setApprovalsCurrentPage((page) => page + 1)}
              disabled={approvalsCurrentPage === approvalTotalPages}
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
