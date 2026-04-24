"use client";

type NotifItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

type Props = {
  open: boolean;
  count: number;
  notifications: NotifItem[];
  onViewAll: () => void;
  size?: "sm" | "md";
};

export default function AdminNotifDropdown({ open, count, notifications, onViewAll, size = "md" }: Props) {
  if (!open) return null;

  const width = size === "sm" ? "w-72" : "w-80";
  const maxH = size === "sm" ? "max-h-64" : "max-h-72";

  return (
    <div className={`absolute right-0 top-8 z-[200] ${width} rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-[#f6fefb]">
        <span className="text-sm font-bold text-slate-800">Notifications</span>
        {count > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{count} new</span>
        )}
      </div>
      <div className={`${maxH} overflow-y-auto divide-y divide-slate-50`}>
        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-slate-400">No recent activity</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="px-4 py-3 hover:bg-[#f6fefb] transition cursor-default">
              <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-slate-100 px-4 py-2.5 bg-[#f6fefb]">
        <button
          type="button"
          onClick={onViewAll}
          className="w-full text-center text-xs font-semibold text-[#1ec28e] hover:underline"
        >
          View all activity →
        </button>
      </div>
    </div>
  );
}
