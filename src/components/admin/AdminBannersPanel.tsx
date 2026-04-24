"use client";

import Image from "next/image";
import type { BannerRecord } from "@/lib/banners-store";

type AdminBannersPanelProps = {
  banners: BannerRecord[];
  loading: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const statusStyles: Record<
  BannerRecord["status"],
  { pill: string; label: string }
> = {
  pending: {
    pill: "border border-amber-200 bg-amber-50 text-amber-700",
    label: "Pending",
  },
  approved: {
    pill: "border border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]",
    label: "Approved",
  },
  rejected: {
    pill: "border border-[#f5c1c1] bg-[#ffe7e7] text-[#cc2a2a]",
    label: "Rejected",
  },
};

export default function AdminBannersPanel({
  banners,
  loading,
  onApprove,
  onReject,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: AdminBannersPanelProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-xs text-slate-500">Total Banners</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{banners.length}</p>
        </div>
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-amber-600">
            {banners.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-xs text-slate-500">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-[#178c43]">
            {banners.filter((b) => b.status === "approved").length}
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {loading ? (
          <li className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            Loading banners...
          </li>
        ) : null}

        {!loading && banners.length === 0 ? (
          <li className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            No banner requests found.
          </li>
        ) : null}

        {!loading && banners.length > 0 ? (
          <li className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 lg:block">
            <div className="grid grid-cols-[0.6fr_1.2fr_1.4fr_1.4fr_0.9fr_0.9fr_1fr] gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Image</span>
              <span>Professional</span>
              <span>Email</span>
              <span>Banner Title</span>
              <span>Submitted</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
          </li>
        ) : null}

        {!loading &&
          banners.map((banner) => {
            const style = statusStyles[banner.status];
            return (
              <li
                key={banner.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-5"
              >
                <div className="grid gap-4 lg:grid-cols-[0.6fr_1.2fr_1.4fr_1.4fr_0.9fr_0.9fr_1fr] lg:items-center">
                  {/* Thumbnail */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                      Image
                    </p>
                    <div className="mt-1 h-12 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        width={80}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Professional name */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                      Professional
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {banner.professionalName}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                      Email
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-600">
                      {banner.professionalEmail}
                    </p>
                  </div>

                  {/* Banner title */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                      Banner Title
                    </p>
                    <p className="mt-1 text-sm text-slate-800">{banner.title}</p>
                  </div>

                  {/* Submission date */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                      Submitted
                    </p>
                    <span className="mt-1 inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </span>
                    {banner.status === "approved" && banner.reviewedAt && (() => {
                      const msLeft = 24 * 60 * 60 * 1000 - (Date.now() - new Date(banner.reviewedAt).getTime());
                      if (msLeft <= 0) return <span className="mt-1 block text-xs text-red-500">Expired</span>;
                      const hLeft = Math.floor(msLeft / 3600000);
                      const mLeft = Math.floor((msLeft % 3600000) / 60000);
                      return <span className="mt-1 block text-xs text-amber-600">⏱ {hLeft}h {mLeft}m left</span>;
                    })()}
                  </div>

                  {/* Status pill */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                      Status
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style.pill}`}
                    >
                      {style.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:justify-end">
                    {banner.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void onApprove(banner.id)}
                          className="inline-flex items-center rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#178c43] transition hover:bg-[#d0f5e0]"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => void onReject(banner.id)}
                          className="inline-flex items-center rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffd0d0]"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this banner?")) {
                          void onDelete(banner.id);
                        }
                      }}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>

      {!loading && banners.length > 0 ? (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  page === currentPage
                    ? "border-[#178c43] bg-[#178c43] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
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
