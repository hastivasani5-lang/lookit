"use client";

import { BellRing, BookOpen, Calendar, CreditCard, Upload, UserCheck, UserPlus, Video } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProfessionalNotification } from "@/types/notifications";
import type { AdminActivityNotification } from "@/app/api/admin/activity-notifications/route";

type AlertsView = "activity" | "professionals" | "students";

type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

type AdminAlertsPanelProps = {
  alertsView: AlertsView;
  setAlertsView: (view: AlertsView) => void;
  notificationsLoading: boolean;
  notifications: ProfessionalNotification[];
  paginatedNotifications: ProfessionalNotification[];
  alertsProfessionalsPageStart: number;
  alertsProfessionalsCurrentPage: number;
  alertsProfessionalsTotalPages: number;
  onAlertsProfessionalsPageChange: (page: number) => void;
  contactMessagesLoading: boolean;
  contactMessages: ContactMessage[];
  paginatedContactMessages: ContactMessage[];
  alertsStudentsPageStart: number;
  alertsStudentsCurrentPage: number;
  alertsStudentsTotalPages: number;
  onAlertsStudentsPageChange: (page: number) => void;
  itemsPerPage: number;
};

const getInitials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "NA";

const typeConfig: Record<AdminActivityNotification["type"], { icon: React.ElementType; color: string; bg: string; label: string }> = {
  new_student:      { icon: UserPlus,   color: "text-blue-700",    bg: "bg-blue-50",    label: "New Student" },
  new_professional: { icon: UserCheck,  color: "text-purple-700",  bg: "bg-purple-50",  label: "New Professional" },
  new_payment:      { icon: CreditCard, color: "text-emerald-700", bg: "bg-emerald-50", label: "Plan Purchased" },
  profile_update:   { icon: BellRing,   color: "text-amber-700",   bg: "bg-amber-50",   label: "Profile Update" },
  new_content:      { icon: BookOpen,   color: "text-rose-700",    bg: "bg-rose-50",    label: "New Content" },
  new_booking:      { icon: Video,      color: "text-teal-700",    bg: "bg-teal-50",    label: "Advance Booking" },
  new_class:        { icon: Calendar,   color: "text-indigo-700",  bg: "bg-indigo-50",  label: "Class Scheduled" },
  banner_upload:    { icon: Upload,      color: "text-orange-700",  bg: "bg-orange-50",  label: "Banner Uploaded" },
};

function ActivityTab() {
  const [items, setItems] = useState<AdminActivityNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/activity-notifications", { cache: "no-store" });
        if (!res.ok) { setItems([]); return; }
        const data = (await res.json()) as { notifications?: AdminActivityNotification[] };
        setItems(Array.isArray(data.notifications) ? data.notifications : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
    const interval = setInterval(() => { void load(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading activity...</div>;
  }

  if (items.length === 0) {
    return <div className="p-6 text-sm text-slate-500">No recent activity in the last 7 days.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const cfg = typeConfig[item.type];
        const Icon = cfg.icon;
        return (
          <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
              <Icon className={`h-4 w-4 ${cfg.color}`} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm text-slate-700">{item.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAlertsPanel({
  alertsView,
  setAlertsView,
  notificationsLoading,
  notifications,
  paginatedNotifications,
  alertsProfessionalsPageStart,
  alertsProfessionalsCurrentPage,
  alertsProfessionalsTotalPages,
  onAlertsProfessionalsPageChange,
  contactMessagesLoading,
  contactMessages,
  paginatedContactMessages,
  alertsStudentsPageStart,
  alertsStudentsCurrentPage,
  alertsStudentsTotalPages,
  onAlertsStudentsPageChange,
  itemsPerPage,
}: AdminAlertsPanelProps) {
  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex w-full max-w-lg items-center gap-2 rounded-xl bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setAlertsView("activity")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              alertsView === "activity" ? "bg-[#2d6a4f] text-white" : "text-slate-600 hover:bg-white"
            }`}
          >
            Activity
          </button>
          <button
            type="button"
            onClick={() => setAlertsView("professionals")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              alertsView === "professionals" ? "bg-[#2d6a4f] text-white" : "text-slate-600 hover:bg-white"
            }`}
          >
            Professional
          </button>
          <button
            type="button"
            onClick={() => setAlertsView("students")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              alertsView === "students" ? "bg-[#2d6a4f] text-white" : "text-slate-600 hover:bg-white"
            }`}
          >
            Students
          </button>
        </div>
      </div>

      {alertsView === "activity" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Real-Time Activity</h3>
            <p className="text-sm text-slate-500">New registrations, plan purchases, content uploads, and profile updates from the last 7 days.</p>
          </div>
          <ActivityTab />
        </div>
      )}

      {alertsView === "professionals" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Professional Notifications</h3>
              <p className="text-sm text-slate-500">Latest profile, certificate, and upgrade changes from professionals.</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl">
            {notificationsLoading ? (
              <div className="bg-white p-4 text-sm text-slate-500">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                {paginatedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                          {getInitials(notification.professionalName)}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-800">{notification.professionalName}</p>
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                              <BellRing className="h-3 w-3" />
                              Update
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-500">{notification.professionalEmail}</p>
                          <p className="text-sm font-medium text-slate-700">{notification.summary}</p>
                          <p className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">{notification.details}</p>
                        </div>
                      </div>
                      <span className="inline-flex w-fit shrink-0 rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-4 text-sm text-slate-500">No professional updates yet.</div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="mt-4 flex justify-end">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => onAlertsProfessionalsPageChange(Math.max(1, alertsProfessionalsCurrentPage - 1))} disabled={alertsProfessionalsCurrentPage === 1} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
                {Array.from({ length: alertsProfessionalsTotalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} type="button" onClick={() => onAlertsProfessionalsPageChange(page)} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${alertsProfessionalsCurrentPage === page ? "border-[#178c43] bg-[#178c43] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{page}</button>
                ))}
                <button type="button" onClick={() => onAlertsProfessionalsPageChange(Math.min(alertsProfessionalsTotalPages, alertsProfessionalsCurrentPage + 1))} disabled={alertsProfessionalsCurrentPage === alertsProfessionalsTotalPages} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {alertsView === "students" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Student Submissions</h3>
              <p className="text-sm text-slate-500">Messages submitted from students through the Contact page form.</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl">
            {contactMessagesLoading ? (
              <div className="bg-white p-4 text-sm text-slate-500">Loading contact submissions...</div>
            ) : contactMessages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContactMessages.map((entry) => (
                      <tr key={entry.id} className="border-t border-slate-100 text-slate-700">
                        <td className="px-4 py-3 font-medium text-slate-800">{entry.name}</td>
                        <td className="px-4 py-3">{entry.email}</td>
                        <td className="px-4 py-3">{entry.phone || "-"}</td>
                        <td className="px-4 py-3">{entry.subject}</td>
                        <td className="px-4 py-3 max-w-85"><p className="line-clamp-3">{entry.message}</p></td>
                        <td className="px-4 py-3 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-4 text-sm text-slate-500">No contact submissions yet.</div>
            )}
          </div>

          {contactMessages.length > 0 && (
            <div className="mt-4 flex justify-end">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => onAlertsStudentsPageChange(Math.max(1, alertsStudentsCurrentPage - 1))} disabled={alertsStudentsCurrentPage === 1} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
                {Array.from({ length: alertsStudentsTotalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} type="button" onClick={() => onAlertsStudentsPageChange(page)} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${alertsStudentsCurrentPage === page ? "border-[#178c43] bg-[#178c43] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{page}</button>
                ))}
                <button type="button" onClick={() => onAlertsStudentsPageChange(Math.min(alertsStudentsTotalPages, alertsStudentsCurrentPage + 1))} disabled={alertsStudentsCurrentPage === alertsStudentsTotalPages} className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
