"use client";

import Image from "next/image";
import {
  Bell,
  ClipboardList,
  DollarSign,
  FolderTree,
  GraduationCap,
  Home,
  MoreHorizontal,
  PencilLine,
  ShieldCheck,
  Trash2,
  X,
  UploadCloud,
  Users,
  BellRing,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { ProfessionalNotification } from "@/types/notifications";

const students = [
  { name: "Evelyn Harper", id: "PRE43178", marks: 1185, percent: "98%" },
  { name: "Diana Plenty", id: "PRE43174", marks: 1165, percent: "91%" },
  { name: "John Millar", id: "PRE43187", marks: 1175, percent: "92%" },
];

type AdminSection =
  | "Dashboard"
  | "Users"
  | "Approvals"
  | "Reviews"
  | "Categories"
  | "Uploads"
  | "Payouts"
  | "Alerts";

type ApprovalStatus = "pending" | "approved" | "rejected";

type ApprovalRequest = {
  id: number;
  name: string;
  type: string;
  updated: string;
  status: ApprovalStatus;
};

type ReviewEntry = {
  id: number;
  userName: string;
  professionalName: string;
  professionalDetails: string;
  review: string;
  rating: number;
  createdAt: string;
  flagged: boolean;
};

type StudentCategory = "Science" | "Arts" | "Commerce" | "Technology" | "Sports";

type AdminStudent = {
  id: number;
  name: string;
  email: string;
  category: StudentCategory;
  grade: string;
  age: number;
  phone: string;
  guardian: string;
  address: string;
  marks: number;
  progress: string;
  joinedAt: string;
};

const menuItems: Array<{ label: AdminSection; icon: typeof Home }> = [
  { label: "Dashboard", icon: Home },
  { label: "Users", icon: Users },
  { label: "Approvals", icon: ShieldCheck },
  { label: "Reviews", icon: ClipboardList },
  { label: "Categories", icon: FolderTree },
  { label: "Uploads", icon: UploadCloud },
  { label: "Payouts", icon: DollarSign },
  { label: "Alerts", icon: BellRing },
];

const initialApprovalRequests: ApprovalRequest[] = [
  { id: 1, name: "Primary record", type: "System", updated: "Today", status: "pending" },
  { id: 2, name: "Secondary queue", type: "Manual", updated: "Yesterday", status: "pending" },
];

const initialReviewEntries: ReviewEntry[] = [
  {
    id: 1,
    userName: "Avery Stone",
    professionalName: "Dr. Maya Patel",
    professionalDetails: "Mathematics Tutor · 8 years experience · Online",
    review: "Excellent explanations and very patient. My grades improved within weeks.",
    rating: 5,
    createdAt: "Today",
    flagged: false,
  },
  {
    id: 2,
    userName: "Noah Kim",
    professionalName: "Jordan Reed",
    professionalDetails: "Career Coach · Interview Prep · San Francisco",
    review: "This was a waste of time and the coach was useless.",
    rating: 1,
    createdAt: "Yesterday",
    flagged: true,
  },
  {
    id: 3,
    userName: "Lina Gomez",
    professionalName: "Priya Shah",
    professionalDetails: "Physics Instructor · Exam Preparation · Hybrid",
    review: "Very helpful and organized. The session notes were clear and easy to follow.",
    rating: 5,
    createdAt: "2 days ago",
    flagged: false,
  },
  {
    id: 4,
    userName: "Ethan Brooks",
    professionalName: "Michael Chen",
    professionalDetails: "Coding Mentor · JavaScript & React · Remote",
    review: "Terrible experience. The professional was rude and completely incompetent.",
    rating: 1,
    createdAt: "3 days ago",
    flagged: true,
  },
];

const initialStudents: AdminStudent[] = [
  {
    id: 1,
    name: "Ava Johnson",
    email: "ava.johnson@example.com",
    category: "Science",
    grade: "Grade 10",
    age: 15,
    phone: "+1 555 101 2001",
    guardian: "Michael Johnson",
    address: "12 Elm Street, Boston, MA",
    marks: 92,
    progress: "Excellent",
    joinedAt: "2026-01-12",
  },
  {
    id: 2,
    name: "Noah Williams",
    email: "noah.williams@example.com",
    category: "Arts",
    grade: "Grade 11",
    age: 16,
    phone: "+1 555 101 2002",
    guardian: "Sarah Williams",
    address: "84 Maple Avenue, Austin, TX",
    marks: 88,
    progress: "Very Good",
    joinedAt: "2025-11-28",
  },
  {
    id: 3,
    name: "Mia Patel",
    email: "mia.patel@example.com",
    category: "Commerce",
    grade: "Grade 12",
    age: 17,
    phone: "+1 555 101 2003",
    guardian: "Rohan Patel",
    address: "221 Pine Road, Seattle, WA",
    marks: 95,
    progress: "Excellent",
    joinedAt: "2025-09-05",
  },
  {
    id: 4,
    name: "Ethan Lee",
    email: "ethan.lee@example.com",
    category: "Technology",
    grade: "Grade 9",
    age: 14,
    phone: "+1 555 101 2004",
    guardian: "Grace Lee",
    address: "67 Cedar Lane, San Jose, CA",
    marks: 90,
    progress: "Good",
    joinedAt: "2026-02-02",
  },
  {
    id: 5,
    name: "Sophia Martin",
    email: "sophia.martin@example.com",
    category: "Sports",
    grade: "Grade 10",
    age: 15,
    phone: "+1 555 101 2005",
    guardian: "Laura Martin",
    address: "19 River Street, Denver, CO",
    marks: 86,
    progress: "Good",
    joinedAt: "2025-12-19",
  },
];

const editableStudentFields: Array<{
  key: Exclude<keyof AdminStudent, "id" | "age" | "marks">;
  label: string;
}> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "category", label: "Category" },
  { key: "grade", label: "Grade" },
  { key: "phone", label: "Phone" },
  { key: "guardian", label: "Guardian" },
  { key: "address", label: "Address" },
  { key: "progress", label: "Progress" },
];

const approvalStatusStyles: Record<
  ApprovalStatus,
  { row: string; pill: string; label: string }
> = {
  pending: {
    row: "bg-white",
    pill: "border border-amber-200 bg-amber-50 text-amber-700",
    label: "Pending",
  },
  approved: {
    row: "bg-[#f0fbf4]",
    pill: "border border-[#bfe9cb] bg-[#e8f9ee] text-[#178c43]",
    label: "Approved",
  },
  rejected: {
    row: "bg-[#fff1f1]",
    pill: "border border-[#f5c1c1] bg-[#ffe7e7] text-[#cc2a2a]",
    label: "Rejected",
  },
};

export default function AdminPanelView() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("Dashboard");
  const [studentsList, setStudentsList] = useState(initialStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [studentDraft, setStudentDraft] = useState<AdminStudent | null>(null);
  const [approvalRequests, setApprovalRequests] = useState(initialApprovalRequests);
  const [reviewEntries, setReviewEntries] = useState(initialReviewEntries);
  const [notifications, setNotifications] = useState<ProfessionalNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const selectedStudent = studentsList.find((student) => student.id === selectedStudentId) ?? null;
  const editingStudent = studentsList.find((student) => student.id === editingStudentId) ?? null;

  const updateApprovalStatus = (id: number, status: Exclude<ApprovalStatus, "pending">) => {
    setApprovalRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              updated: "Just now",
            }
          : request,
      ),
    );
  };

  const approvalCounts = approvalRequests.reduce(
    (counts, request) => {
      counts.total += 1;
      if (request.status === "pending") counts.pending += 1;
      if (request.status === "approved") counts.approved += 1;
      if (request.status === "rejected") counts.rejected += 1;
      return counts;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 },
  );

  const deleteReview = (id: number) => {
    setReviewEntries((currentReviews) => currentReviews.filter((review) => review.id !== id));
  };

  const reviewCounts = reviewEntries.reduce(
    (counts, review) => {
      counts.total += 1;
      if (review.flagged) counts.flagged += 1;
      return counts;
    },
    { total: 0, flagged: 0 },
  );

  useEffect(() => {
    if (activeSection !== "Users") {
      setSelectedStudentId(null);
      setEditingStudentId(null);
      setStudentDraft(null);
    }
  }, [activeSection]);

  const openStudentDetails = (studentId: number) => {
    setSelectedStudentId(studentId);
  };

  const openEditStudent = (studentId: number) => {
    const student = studentsList.find((item) => item.id === studentId) ?? null;

    if (!student) return;

    setSelectedStudentId(studentId);
    setEditingStudentId(studentId);
    setStudentDraft({ ...student });
  };

  const closeEditStudent = () => {
    setEditingStudentId(null);
    setStudentDraft(null);
  };

  const saveStudent = () => {
    if (!studentDraft) return;

    setStudentsList((currentStudents) =>
      currentStudents.map((student) => (student.id === studentDraft.id ? studentDraft : student)),
    );
    setSelectedStudentId(studentDraft.id);
    closeEditStudent();
  };

  const deleteStudent = (studentId: number) => {
    setStudentsList((currentStudents) => currentStudents.filter((student) => student.id !== studentId));

    if (selectedStudentId === studentId) {
      const remainingStudents = studentsList.filter((student) => student.id !== studentId);
      setSelectedStudentId(remainingStudents[0]?.id ?? null);
    }

    if (editingStudentId === studentId) {
      closeEditStudent();
    }
  };

  useEffect(() => {
    if (activeSection !== "Alerts") {
      return;
    }

    const loadNotifications = async () => {
      setNotificationsLoading(true);

      try {
        const response = await fetch("/api/admin/notifications", { cache: "no-store" });

        if (!response.ok) {
          setNotifications([]);
          return;
        }

        const data = (await response.json()) as { notifications?: ProfessionalNotification[] };
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } catch {
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };

    void loadNotifications();
  }, [activeSection]);

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#eef0fb] p-3 sm:p-4 md:p-6">
      <section className="mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-[1450px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.14)] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-100 bg-white px-4 py-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-2 pb-6">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1ec28e]/10 text-[#1ec28e]">
              <GraduationCap className="h-4 w-4" />
            </span>
            <p className="text-2xl font-bold text-slate-800">Schooli</p>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveSection(item.label)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "bg-[#ecf9f3] text-[#1ec28e]"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className={`bg-[#f8f9ff] p-3 sm:p-4 md:p-5 transition ${selectedStudent ? "blur-sm" : ""}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 sm:p-4">
            <input
              type="text"
              placeholder="Search anything here"
              className="h-10 w-full max-w-xs rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
            />
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden text-slate-600 sm:inline">Open For Order</span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#1ec28e]" />
              <Bell className="h-4 w-4 text-slate-500" />
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1">
                <Image src="/pro1.jpeg" alt="admin" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
                <span className="text-slate-700">Luke J R</span>
              </div>
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto rounded-xl bg-white p-2 lg:hidden">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveSection(item.label)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  activeSection === item.label
                    ? "bg-[#fdf1f3] text-[#f15068]"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeSection === "Dashboard" ? (
            <div className="rounded-2xl bg-white p-4 sm:p-5">
              <h2 className="text-3xl font-semibold text-slate-800">Welcome.</h2>
              <p className="mb-4 text-sm text-slate-500">Navigate the future of education with Schooli.</p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[#f7f0ff] p-4">
                  <p className="text-xs text-slate-500">Students</p>
                  <p className="text-3xl font-bold text-slate-800">15.00K</p>
                </div>
                <div className="rounded-xl bg-[#eef7ff] p-4">
                  <p className="text-xs text-slate-500">Teachers</p>
                  <p className="text-3xl font-bold text-slate-800">200</p>
                </div>
                <div className="rounded-xl bg-[#fff5ef] p-4">
                  <p className="text-xs text-slate-500">Awards</p>
                  <p className="text-3xl font-bold text-slate-800">5.6K</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">Star Students</h3>
                      <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="text-left text-slate-400">
                        <tr>
                          <th className="py-2">Name</th>
                          <th className="py-2">ID</th>
                          <th className="py-2">Marks</th>
                          <th className="py-2">Percent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-t border-slate-100 text-slate-700">
                            <td className="py-2.5">{student.name}</td>
                            <td className="py-2.5">{student.id}</td>
                            <td className="py-2.5">{student.marks}</td>
                            <td className="py-2.5">{student.percent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">Notifications</h3>
                      <button className="text-sm text-slate-400 hover:text-slate-600">View all</button>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="rounded-lg bg-[#f8f9ff] px-3 py-2">Emergency School Closure</div>
                      <div className="rounded-lg bg-[#f8f9ff] px-3 py-2">New Extracurricular Clubs</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <h3 className="font-semibold text-slate-800">Course Statistics</h3>
                    <div className="mx-auto mt-4 grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#7c4dff_0_45%,#1ec28e_45%_73%,#ffd166_73%_100%)] p-3">
                      <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                        <p className="text-xs text-slate-400">Total</p>
                        <p className="text-2xl font-bold text-slate-800">15000</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <h3 className="font-semibold text-slate-800">Total Exams</h3>
                    <p className="mt-2 text-4xl font-bold text-slate-800">256</p>
                    <p className="mt-1 text-xs text-slate-500">Here is your total exams ratio this month.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                {activeSection === "Users"
                  ? "User Management"
                  : activeSection === "Approvals"
                    ? "Teacher Requests"
                    : activeSection === "Reviews"
                      ? "Review Moderation"
                      : activeSection === "Categories"
                        ? "Category Management"
                        : activeSection === "Uploads"
                          ? "Book Upload Center"
                          : activeSection === "Payouts"
                            ? "Teacher Payments"
                            : "Teacher Notifications"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {activeSection === "Users" && "Manage account status, roles, and access permissions."}
                {activeSection === "Approvals" && "Approve or reject pending teacher onboarding requests."}
                {activeSection === "Reviews" && "Review, approve, or remove reported platform feedback."}
                {activeSection === "Categories" && "Create and manage course and library categories."}
                {activeSection === "Uploads" && "Upload books and assign metadata for publishing."}
                {activeSection === "Payouts" && "Track payouts and settle teacher earnings securely."}
                {activeSection === "Alerts" && "Professional updates appear here automatically."}
              </p>

              {activeSection === "Approvals" ? (
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

                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Updated</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvalRequests.map((request) => {
                          const statusStyle = approvalStatusStyles[request.status];

                          return (
                            <tr key={request.id} className={`border-t border-slate-100 text-slate-700 ${statusStyle.row}`}>
                              <td className="px-4 py-4 font-medium text-slate-800">{request.name}</td>
                              <td className="px-4 py-4">{request.type}</td>
                              <td className="px-4 py-4">{request.updated}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex min-w-24 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle.pill}`}>
                                  {statusStyle.label}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex justify-end gap-2">
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
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeSection === "Reviews" ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Total Reviews</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-800">{reviewCounts.total}</p>
                    </div>
                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Flagged Reviews</p>
                      <p className="mt-1 text-2xl font-semibold text-[#cc2a2a]">{reviewCounts.flagged}</p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Professional</th>
                          <th className="px-4 py-3">Review</th>
                          <th className="px-4 py-3">Rating</th>
                          <th className="px-4 py-3">Created</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviewEntries.map((review) => (
                          <tr
                            key={review.id}
                            className={`border-t border-slate-100 text-slate-700 ${review.flagged ? "bg-[#fff1f1]" : "bg-white"}`}
                          >
                            <td className="px-4 py-4 font-medium text-slate-800">{review.userName}</td>
                            <td className="px-4 py-4">
                              <div className="font-medium text-slate-800">{review.professionalName}</div>
                              <div className="text-xs text-slate-500">{review.professionalDetails}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="max-w-xl space-y-1">
                                <p className="text-slate-700">{review.review}</p>
                                {review.flagged ? (
                                  <span className="inline-flex rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#cc2a2a]">
                                    Flagged as inappropriate
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-semibold text-slate-800">{review.rating}/5</td>
                            <td className="px-4 py-4 text-slate-600">{review.createdAt}</td>
                            <td className="px-4 py-4">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => deleteReview(review.id)}
                                  className="inline-flex items-center gap-1 rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeSection === "Alerts" ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Professional Notifications</h3>
                      <p className="text-sm text-slate-500">Latest profile, certificate, and upgrade changes from professionals.</p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    {notificationsLoading ? (
                      <div className="bg-white p-4 text-sm text-slate-500">Loading notifications...</div>
                    ) : notifications.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="bg-white p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-1">
                                <p className="font-semibold text-slate-800">{notification.professionalName}</p>
                                <p className="text-xs text-slate-500">{notification.professionalEmail}</p>
                                <p className="text-sm text-slate-700">{notification.summary}</p>
                                <p className="text-xs text-slate-500">{notification.details}</p>
                              </div>
                              <span className="inline-flex w-fit rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
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
                </div>
              ) : activeSection === "Users" ? (
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <h3 className="font-semibold text-slate-800">Students</h3>
                    <p className="text-sm text-slate-500">Click a student to open a full details page.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-left text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Grade</th>
                          <th className="px-4 py-3">Marks</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsList.map((student) => {
                          const isSelected = selectedStudentId === student.id;

                          return (
                            <tr
                              key={student.id}
                              onClick={() => openStudentDetails(student.id)}
                              className={`cursor-pointer border-t border-slate-100 transition ${
                                isSelected ? "bg-[#f0fbf4]" : "bg-white hover:bg-slate-50"
                              }`}
                            >
                              <td className="px-4 py-4">
                                <div className="font-medium text-slate-800">{student.name}</div>
                                <div className="text-xs text-slate-500">{student.email}</div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="rounded-full bg-[#eef7ff] px-2.5 py-1 text-xs font-semibold text-[#2563eb]">
                                  {student.category}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-slate-700">{student.grade}</td>
                              <td className="px-4 py-4 text-slate-700">{student.marks}%</td>
                              <td className="px-4 py-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openEditStudent(student.id);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#178c43] transition hover:bg-[#dff6e8]"
                                  >
                                    <PencilLine className="h-3.5 w-3.5" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deleteStudent(student.id);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-3 py-1.5 text-xs font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-[#fff9fa] p-4">
                    <p className="text-sm text-slate-500">Total Records</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-800">24</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#fff9fa] p-4">
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-800">08</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#fff9fa] p-4">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="mt-1 text-2xl font-semibold text-[#1ec28e]">Active</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedStudent && !editingStudent ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Student Details</h3>
                <p className="text-sm text-slate-500">Full form-style view of the selected student.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentId(null)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-2xl bg-[#f8fafc] p-5">
                <p className="text-sm text-slate-500">Category</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">{selectedStudent.category}</p>
                <p className="mt-4 text-sm text-slate-500">Name</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">{selectedStudent.name}</p>
                <p className="mt-4 text-sm text-slate-500">Email</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{selectedStudent.email}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Grade</span>
                  <input value={selectedStudent.grade} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Age</span>
                  <input value={selectedStudent.age} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Phone</span>
                  <input value={selectedStudent.phone} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Guardian</span>
                  <input value={selectedStudent.guardian} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm sm:col-span-2">
                  <span className="text-slate-500">Address</span>
                  <textarea value={selectedStudent.address} readOnly rows={2} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Marks</span>
                  <input value={`${selectedStudent.marks}%`} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-slate-500">Progress</span>
                  <input value={selectedStudent.progress} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
                <label className="space-y-1 text-sm sm:col-span-2">
                  <span className="text-slate-500">Joined</span>
                  <input value={selectedStudent.joinedAt} readOnly className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none" />
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => openEditStudent(selectedStudent.id)}
                className="rounded-full border border-[#bfe9cb] bg-[#e8f9ee] px-4 py-2 text-sm font-semibold text-[#178c43] transition hover:bg-[#dff6e8]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteStudent(selectedStudent.id)}
                className="rounded-full border border-[#f5c1c1] bg-[#ffe7e7] px-4 py-2 text-sm font-semibold text-[#cc2a2a] transition hover:bg-[#ffdcdc]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingStudent && studentDraft ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Edit Student</h3>
                <p className="text-sm text-slate-500">Update the student record and save changes.</p>
              </div>
              <button
                type="button"
                onClick={closeEditStudent}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {editableStudentFields.map((field) => (
                <label key={field.key} className="space-y-1 text-sm">
                  <span className="text-slate-500">{field.label}</span>
                  <input
                    value={studentDraft[field.key]}
                    onChange={(event) =>
                      setStudentDraft((current) =>
                        current
                          ? {
                              ...current,
                              [field.key]:
                                field.key === "category"
                                  ? (event.target.value as StudentCategory)
                                  : event.target.value,
                            }
                          : current,
                      )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
                  />
                </label>
              ))}
              <label className="space-y-1 text-sm">
                <span className="text-slate-500">Age</span>
                <input
                  type="number"
                  value={studentDraft.age}
                  onChange={(event) =>
                    setStudentDraft((current) => (current ? { ...current, age: Number(event.target.value) } : current))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-slate-500">Marks</span>
                <input
                  type="number"
                  value={studentDraft.marks}
                  onChange={(event) =>
                    setStudentDraft((current) => (current ? { ...current, marks: Number(event.target.value) } : current))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1ec28e]"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditStudent}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveStudent}
                className="rounded-full bg-[#1ec28e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18ad7d]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
