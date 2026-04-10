import React from "react";
import ApprovalsList from "./ApprovalsList";

interface ApprovalsSectionProps {
  approvalRequests: any[];
  approvalStatusStyles: any;
  updateApprovalStatus: (id: string, status: string) => void;
  openDetailModal: (payload: any) => void;
  approvalCounts: { total: number; pending: number; approved: number; rejected: number };
}

const ApprovalsSection: React.FC<ApprovalsSectionProps> = ({
  approvalRequests,
  approvalStatusStyles,
  updateApprovalStatus,
  openDetailModal,
  approvalCounts,
}) => (
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
    <ApprovalsList
      approvalRequests={approvalRequests}
      approvalStatusStyles={approvalStatusStyles}
      updateApprovalStatus={updateApprovalStatus}
      openDetailModal={openDetailModal}
    />
  </div>
);

export default ApprovalsSection;
