import React from "react";
import NeumorphListCard from "./NeumorphListCard";
import { Eye } from "lucide-react";

interface ApprovalRequest {
  id: string;
  name: string;
  specialization: string;
  updated: string;
  status: string;
}

interface ApprovalStatusStyles {
  [key: string]: {
    row: string;
    pill: string;
    label: string;
  };
}

interface ApprovalsListProps {
  approvalRequests: ApprovalRequest[];
  approvalStatusStyles: ApprovalStatusStyles;
  updateApprovalStatus: (id: string, status: string) => void;
  openDetailModal: (payload: any) => void;
}

const ApprovalsList: React.FC<ApprovalsListProps> = ({
  approvalRequests,
  approvalStatusStyles,
  updateApprovalStatus,
  openDetailModal,
}) => (
  <ul className="flex flex-col gap-3">
    {approvalRequests.map((request) => {
      const statusStyle = approvalStatusStyles[request.status];
      return (
        <NeumorphListCard key={request.id} className={statusStyle.row}>
          <div className="flex-1 min-w-[120px] font-medium text-slate-800">{request.name}</div>
          <div className="flex-1 min-w-[120px] text-slate-700">{request.specialization || '-'}</div>
          <div className="flex-1 min-w-[100px] text-slate-700">{request.updated}</div>
          <div className="flex-1 min-w-[100px]">
            <span className={`inline-flex min-w-24 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle.pill}`}>
              {statusStyle.label}
            </span>
          </div>
          <div className="flex flex-1 justify-end gap-2 min-w-[180px]">
            <button
              type="button"
              onClick={() => updateApprovalStatus(request.id, "approved")}
              className="rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#178c43] transition hover:bg-[#dff6e8]"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => updateApprovalStatus(request.id, "rejected")}
              className="rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
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
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
          </div>
        </NeumorphListCard>
      );
    })}
  </ul>
);

export default ApprovalsList;
